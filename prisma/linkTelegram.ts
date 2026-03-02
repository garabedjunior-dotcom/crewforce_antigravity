import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { telegramChatId: '6835726434' },
        });
        console.log(`✅ Usuário ${user.name} atualizado com o Telegram ID: 6835726434!`);
    } else {
        console.log('❌ Usuário admin não encontrado.');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
