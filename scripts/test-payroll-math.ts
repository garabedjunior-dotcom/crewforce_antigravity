import { PrismaClient } from '@prisma/client'
import { calculateWeeklyPayroll } from '../src/lib/payroll-calculator';

const prisma = new PrismaClient()

async function main() {
    console.log('🧪 Testing Payroll Calculation Engine...');

    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-12-31');

    // Find a test worker (W2 with Piece Rate Enabled)
    const worker = await prisma.user.findFirst({
        where: { email: 'admin@crewforce.app' }
    });

    if (!worker) {
        console.log('Test worker not found. Creating mock...');
        return;
    }

    // Inject some fake timecards (40 hours week)
    console.log(`Injecting test timecards for worker ${worker.name}...`);
    const tc = await prisma.timecard.create({
        data: {
            workerId: worker.id,
            checkIn: new Date(),
            checkOut: new Date(new Date().getTime() + (40 * 60 * 60 * 1000)), // +40h
            totalHours: 40,
            status: 'APPROVED'
        }
    });

    // Inject a Daily Log with Production Items (HDD_FT = 450 units @ $0.85 = $382.50)
    console.log(`Injecting production logs for worker ${worker.name}...`);
    const log = await prisma.dailyLog.create({
        data: {
            workerId: worker.id,
            projectId: (await prisma.project.findFirst())?.id || "",
            description: "/log Test digging",
            imageUrls: []
        }
    });

    await prisma.productionLog.create({
        data: {
            dailyLogId: log.id,
            payItemCode: "HDD_FT",
            quantity: 450
        }
    });

    console.log(`\n================================`);
    console.log(`CALCULATING PAYROLL...`);
    console.log(`================================`);

    // Run the calculator
    const results = await calculateWeeklyPayroll(startDate, endDate);
    const myResult = results.find(r => r.workerId === worker.id);

    console.log(JSON.stringify(myResult, null, 2));

    // Cleanup 
    await prisma.timecard.delete({ where: { id: tc.id } });
    await prisma.productionLog.deleteMany({ where: { dailyLogId: log.id } });
    await prisma.dailyLog.delete({ where: { id: log.id } });

    console.log('\n✅ Test complete and cleanup done.');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
