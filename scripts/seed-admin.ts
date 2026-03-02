import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = "admin@crewforce.app";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "ADMIN",
        },
        create: {
            name: "CrewForce Admin",
            email: email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("✅ Admin user credentials forcibly updated/created!");
    console.log("Email:", admin.email);
    console.log("Password:", password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
