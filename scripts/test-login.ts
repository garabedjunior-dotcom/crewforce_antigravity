import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@crewforce.app";
    const pass = "crewforce2026";
    const u = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", !!u);
    if (u && u.password) {
        console.log("Hash:", u.password);
        const ok = await bcrypt.compare(pass, u.password);
        console.log("VALID:", ok);
    } else {
        console.log("No password set");
    }
}
main().finally(async () => {
    await prisma.$disconnect()
});
