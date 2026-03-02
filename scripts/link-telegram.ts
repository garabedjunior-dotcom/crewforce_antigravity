import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const telegramId = "6835726434";

    // Find the admin user
    const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    });

    if (!adminUser) {
        console.error("No admin user found to link.");
        return;
    }

    const updatedUser = await prisma.user.update({
        where: { id: adminUser.id },
        data: { telegramChatId: telegramId }
    });

    console.log(`Successfully linked Telegram ID ${telegramId} to user ${updatedUser.name} (${updatedUser.email}).`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
