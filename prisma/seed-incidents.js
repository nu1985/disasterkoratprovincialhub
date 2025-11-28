const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding incidents...')

    const floodType = await prisma.incidentType.findUnique({ where: { code: 'FLOOD' } })
    const fireType = await prisma.incidentType.findUnique({ where: { code: 'FIRE' } })
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } })

    if (!floodType || !fireType || !admin) {
        console.error('Required data not found')
        return
    }

    await prisma.incident.create({
        data: {
            title: 'Flash Flood in City Center',
            description: 'Heavy rain caused flooding in the market area.',
            incidentType: { connect: { id: floodType.id } },
            severity: 'HIGH',
            status: 'NEW',
            latitude: 14.9799,
            longitude: 102.0978,
            reportedAt: new Date(),
            createdByUser: { connect: { id: admin.id } }
        }
    })

    await prisma.incident.create({
        data: {
            title: 'Small Fire at Warehouse',
            description: 'Electrical fire, contained.',
            incidentType: { connect: { id: fireType.id } },
            severity: 'MEDIUM',
            status: 'DONE',
            latitude: 14.9850,
            longitude: 102.1000,
            reportedAt: new Date(Date.now() - 3600000), // 1 hour ago
            createdByUser: { connect: { id: admin.id } }
        }
    })

    console.log('Incidents seeded.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
