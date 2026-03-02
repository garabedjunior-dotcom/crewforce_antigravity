import { NextResponse } from "next/server";
import { requireAuthForApi, isAuthError } from "@/lib/auth-guard";

export async function GET(req: Request) {
    // Require any authenticated user to access Telegram images
    const authResult = await requireAuthForApi();
    if (isAuthError(authResult)) return authResult;

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
        return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    try {
        const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

        // 1. Get file path from Telegram
        const fileRes = await fetch(`${TELEGRAM_API_URL}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        if (!fileData.ok) {
            return NextResponse.json({ error: "Failed to fetch file info from Telegram" }, { status: 500 });
        }

        const filePath = fileData.result.file_path;

        // 2. Fetch the actual file bytes
        const imageRes = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`);

        if (!imageRes.ok) {
            return NextResponse.json({ error: "Failed to fetch image data" }, { status: 500 });
        }

        const buffer = await imageRes.arrayBuffer();

        // 3. Return the image with proper headers
        return new NextResponse(buffer, {
            headers: {
                "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            }
        });
    } catch (error) {
        console.error("TG Image Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
