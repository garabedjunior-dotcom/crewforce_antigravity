import "dotenv/config";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${TOKEN}`;
const LOCAL_WEBHOOK_URL = "http://localhost:3000/api/webhook/telegram";

let lastUpdateId = 0;

async function poll() {
    try {
        const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
        const data: any = await res.json();

        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                lastUpdateId = update.update_id;
                console.log(`[Telegram Poll] Forwarding update ${update.update_id} to Localhost...`);

                try {
                    // Forwarding the update exactly like Telegram would to our Local webhook
                    await fetch(LOCAL_WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(update),
                    });
                } catch (e) {
                    console.error(`❌ Connection refused to Local Webhook. Is Next.js running on port 3000?`);
                }
            }
        }
    } catch (error) {
        if ((error as any).code === 'UND_ERR_CONNECT_TIMEOUT') {
            // ignore
        } else {
            console.error("Polling error:", error);
        }
    } finally {
        // Keep polling
        setTimeout(poll, 1000);
    }
}

console.log("🚀 Started Local Telegram Poller");
console.log(`🔗 Forwarding Telegram Updates to ${LOCAL_WEBHOOK_URL}`);
// IMPORTANT: delete any webhook configured before so getUpdates works.
fetch(`${API_URL}/deleteWebhook`).then(() => {
    console.log("Deleted any existing Webhook. Ready to receive!");
    poll();
});
