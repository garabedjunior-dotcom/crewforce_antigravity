import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { after } from 'next/server';
import { uploadImageToMinio } from '@/lib/s3';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// Helper to send messages back to the user
async function sendMessage(chatId: string, text: string) {
    if (!TOKEN) throw new Error("Missing TELEGRAM_BOT_TOKEN");

    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        }),
    });
}

// Function to get file path from telegram
async function getPhotoUrl(fileId: string) {
    if (!TOKEN) return "";
    const res = await fetch(`${TELEGRAM_API}/getFile?file_id=${fileId}`);
    const data = await res.json();
    if (data.ok && data.result.file_path) {
        return `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
    }
    return "";
}

export async function POST(req: Request) {
    // 1. Verify webhook secret token
    const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
    if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const update = await req.json();

        // Ensure it's a message
        if (!update.message) {
            return NextResponse.json({ ok: true });
        }

        // Return 200 immediately — process in background with after()
        after(async () => {
            await processWebhookUpdate(update);
        });

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ ok: true }, { status: 200 });
    }
}

async function processWebhookUpdate(update: { message: Record<string, unknown> }) {
    try {
        const msg = update.message;
        const chatId = String((msg.chat as { id: number }).id);
        const text = (msg.text as string) || (msg.caption as string) || "";
        const photos = (msg.photo as Array<{ file_id: string }>) || [];

        // 1. Identify User
        const user = await prisma.user.findUnique({
            where: { telegramChatId: chatId },
            include: {
                crew: {
                    include: { project: true }
                }
            }
        });

        // If unknown user
        if (!user) {
            await sendMessage(chatId, `👷 <b>Welcome to CrewForce!</b>\n\nYour Telegram account is not yet linked.\nPlease give your manager this ID to link your account:\n\n<code>${chatId}</code>`);
            return;
        }

        // If command /start
        if (text.startsWith('/start')) {
            const projectInfo = user.crew?.project ? `Assigned Project: <b>${user.crew.project.name}</b>` : '<i>Not currently assigned to an active project.</i>';
            await sendMessage(chatId, `👷 <b>Welcome back, ${user.name}!</b>\n\n${projectInfo}\n\nTo log your work, simply send a text message describing what you did today, and attach any site photos if needed.`);
            return;
        }

        // 2. Validate Assignment & Project Status
        if (!user.crew?.projectId || !user.crew?.project) {
            await sendMessage(chatId, `⚠️ <b>Action Required:</b> You are not assigned to an active project. Please contact your manager before logging hours.`);
            return;
        }

        if (user.crew.project.status !== 'ACTIVE') {
            await sendMessage(chatId, `⚠️ <b>Invalid Project:</b> Your current project (${user.crew.project.name}) is marked as <b>${user.crew.project.status}</b>. You can only log hours on ACTIVE projects.`);
            return;
        }

        const projectId = user.crew.projectId;

        // 3. Process Message as a Daily Log
        let description = text;
        let dayFraction = 1.0;
        let productionRecords: Array<{ payItemCode: string, quantity: number }> = [];

        const isMediaGroup = !!(msg.media_group_id);

        if (process.env.GEMINI_API_KEY && text.length > 5) {
            try {
                // Fetch valid pay item codes from catalog to instruct Gemini
                const catalogItems = await prisma.payItemCatalog.findMany();
                const catalogContext = catalogItems.map(c => `"${c.code}": ${c.description}`).join(', ');

                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Extract the details from this field worker's daily log: "${text}".
You also have the following valid Pay Item Codes available in the system: ${catalogContext}.
If the worker mentions producing/completing quantities of specific tasks, extract them.
Return ONLY a valid JSON object with:
{
  "cleanedDescription": "A professional summary of the work done, correcting typos",
  "dayFraction": a float (1.0 for a full 8+ hour day, 0.5 for half day, or (hours/8) if specific hours mentioned. Default to 1.0),
  "production": [
      { "payItemCode": "EXACT_CODE_FROM_LIST", "quantity": number_extracted }
  ]
}`,
                });
                const aiText = response.text || "{}";
                const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);

                if (typeof parsed.cleanedDescription === 'string') {
                    description = parsed.cleanedDescription;
                }
                if (parsed.dayFraction !== undefined && parsed.dayFraction !== null) {
                    const parsedNumber = Number(parsed.dayFraction);
                    if (!isNaN(parsedNumber) && parsedNumber >= 0) {
                        dayFraction = parsedNumber;
                    }
                }
                const validCodes = new Set(catalogItems.map(c => c.code));

                if (Array.isArray(parsed.production)) {
                    productionRecords = parsed.production.filter((p: any) => p && validCodes.has(String(p.payItemCode)));
                }
            } catch (error) {
                console.error("AI Parsing failed, using raw text", error);
            }
        } else if (text === "") {
            description = isMediaGroup ? "Album attachment snippet" : "Photo update without description";
            dayFraction = isMediaGroup ? 0 : 1.0;
        }

        // Handle Photos
        const imageUrls: string[] = [];
        if (photos.length > 0) {
            const largestPhoto = photos[photos.length - 1];
            const telegramUrl = await getPhotoUrl(largestPhoto.file_id);
            if (telegramUrl) {
                try {
                    const response = await fetch(telegramUrl);
                    if (!response.ok) throw new Error(`HTTP ${response.status} from Telegram`);

                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const mimeType = response.headers.get('content-type') || 'image/jpeg';
                    const extension = mimeType.split('/')[1] || 'jpg';
                    const filename = `daily-logs/${projectId}/${Date.now()}-${largestPhoto.file_id}.${extension}`;

                    const minioUrl = await uploadImageToMinio(buffer, filename, mimeType);
                    imageUrls.push(minioUrl);
                } catch (err) {
                    console.error("Error migrating photo to MinIO, fallback to TG url:", err);
                    imageUrls.push(telegramUrl);
                }
            }
        }

        // Save Daily Log and Production Logs as nested write
        await prisma.dailyLog.create({
            data: {
                projectId,
                workerId: user.id,
                description,
                dayFraction,
                imageUrls,
                ...(productionRecords.length > 0 && {
                    productionLogs: {
                        create: productionRecords.map(prod => ({
                            payItemCode: prod.payItemCode,
                            quantity: Number(prod.quantity),
                            status: "PENDING"
                        }))
                    }
                })
            }
        });

        // 4. Send Confirmation
        if (dayFraction > 0 || !isMediaGroup) {
            const hoursLogged = (dayFraction * 8).toFixed(1);
            await sendMessage(chatId, `✅ <b>Log Recorded!</b>\n\nProject: <b>${user.crew?.project?.name || 'Unknown'}</b>\nHours Tracked: <b>${hoursLogged}h</b>\n\n<i>"${description}"</i>\n\nYour timesheet has been updated. Excellent work today! 🛠️`);
        }
    } catch (error) {
        console.error("Background webhook processing error:", error);
    }
}
