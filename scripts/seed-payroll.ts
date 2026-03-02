import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Rate Table and Test Workers...')

    // 1. Seed Rate Table
    const rates = [
        { code: "HDD_FT", description: "Urban HDD standard", rateAmount: 0.85, rateUnit: "per FT" },
        { code: "TRENCH_FT", description: "Open trench standard", rateAmount: 0.65, rateUnit: "per FT" },
        { code: "HANDHOLE_EA", description: "Standard handhole", rateAmount: 45, rateUnit: "per EA" },
        { code: "VAULT_EA", description: "Standard vault", rateAmount: 85, rateUnit: "per EA" },
        { code: "POTHOLE_EA", description: "Standard pothole", rateAmount: 35, rateUnit: "per EA" },
        { code: "RESTORATION_SQFT", description: "Area restoration", rateAmount: 2.5, rateUnit: "per SQFT" },
        { code: "BORE_FT", description: "Difficult soil", rateAmount: 0.9, rateUnit: "per FT" },
        { code: "CABLE_PULL_FT", description: "Standard cable pull", rateAmount: 0.4, rateUnit: "per FT" },
        { code: "CONDUIT_FT", description: "Standard conduit", rateAmount: 0.55, rateUnit: "per FT" },
        { code: "REWORK_FT", description: "Rework penalty rate", rateAmount: 0.3, rateUnit: "per FT" },
    ]

    for (const rate of rates) {
        await prisma.payItemCatalog.upsert({
            where: { code: rate.code },
            update: {},
            create: rate,
        })
    }
    console.log('✅ Rate Table Seeded')

    // 2. Adjust current users acting as "Workers"
    await prisma.user.updateMany({
        where: { role: 'WORKER' },
        data: {
            employeeType: "W2",
            baseHourlyRate: 20.0,
            otMultiplier: 1.5,
            minHourlyGuarantee: true,
            pieceRateEnabled: true
        }
    })

    console.log('✅ Updated all existing workers with standard W2 rate of $20/hr.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
