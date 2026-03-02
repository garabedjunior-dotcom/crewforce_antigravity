import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting password migration...");
    const users = await prisma.user.findMany();

    const defaultPassword = await bcrypt.hash("crewforce2026", 10);

    for (const user of users) {
        if (!user.password) {
            await prisma.user.update({
                where: { id: user.id },
                data: { password: defaultPassword }
            });
            console.log(`Updated password for ${user.email}`);
        }
    }
    console.log("Migration complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
