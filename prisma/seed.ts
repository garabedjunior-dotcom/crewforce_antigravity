import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database with initial test data...");

    // 1. Create a Project
    const project = await prisma.project.create({
        data: {
            name: "Fibra Óptica Miami (Test)",
            location: "Miami - Setor Sul",
            status: "ACTIVE",
        },
    });
    console.log(`Created Project: ${project.name}`);

    // 2. Create a Crew
    const crew = await prisma.crew.create({
        data: {
            name: "Equipe Alpha",
            description: "Equipe principal de cabeamento",
            projectId: project.id,
        },
    });
    console.log(`Created Crew: ${crew.name}`);

    // 3. Create a test user mapped to the user's Telegram Chat ID (Replace with the real User Telegram ID later when linking accounts, but for now we leave it empty so the bot can ask for mapping)
    const user = await prisma.user.create({
        data: {
            name: "Admin Worker",
            email: "admin@crewforce.app",
            role: "ADMIN",
            crewId: crew.id,
            // telegramChatId: "SEU_TELEGRAM_AQUI",
        },
    });
    console.log(`Created Admin User: ${user.name}`);

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
