import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const incidentCount = await prisma.incident.count()
    const assignmentCount = await prisma.assignment.count()
    const resourceCount = await prisma.resource.count()

    console.log(`Current Counts:`)
    console.log(`Incidents: ${incidentCount}`)
    console.log(`Assignments: ${assignmentCount}`)
    console.log(`Resources: ${resourceCount}`)

    if (incidentCount >= 10 && assignmentCount >= 10 && resourceCount >= 10) {
        console.log('VERIFICATION_SUCCESS')
    } else {
        console.log('VERIFICATION_FAILURE: Counts are below expected minimum.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
