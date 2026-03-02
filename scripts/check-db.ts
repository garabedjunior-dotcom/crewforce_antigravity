import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany();
    for (const proj of projects) {
        await prisma.project.update({
            where: { id: proj.id },
            data: {
                latitude: 25.7617 + Math.random() * 0.05,
                longitude: -80.1918 + Math.random() * 0.05,
            },
        });
    }
    console.log('Updated', projects.length, 'projects with Miami coordinates');
}

main().catch(console.error).finally(() => prisma.$disconnect());
