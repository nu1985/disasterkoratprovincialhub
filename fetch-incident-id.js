const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const incident = await prisma.incident.findFirst()
    if (incident) {
        console.log(`INCIDENT_ID:${incident.id}`)
    } else {
        console.log("NO_INCIDENTS_FOUND")
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
