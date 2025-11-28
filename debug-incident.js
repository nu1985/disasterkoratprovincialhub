const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const id = 'a7bc14f2-2603-4d97-ab00-dc8b37109ade'
    console.log(`Searching for ID: ${id}`)

    const incident = await prisma.incident.findUnique({
        where: { id },
        include: {
            incidentType: true,
            location: true,
            reporter: true,
            statusHistory: {
                include: {
                    changedByUser: true
                },
                orderBy: {
                    changedAt: 'desc'
                }
            },
            assignments: {
                include: {
                    resource: true
                },
                orderBy: {
                    assignedAt: 'desc'
                }
            }
        }
    })

    if (incident) {
        console.log("FOUND_INCIDENT")
        console.log(incident.title)
    } else {
        console.log("INCIDENT_NOT_FOUND_IN_SCRIPT")
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
