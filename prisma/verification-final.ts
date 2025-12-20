import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    const incidentCount = await prisma.incident.count()
    const assignmentCount = await prisma.assignment.count()
    const resourceCount = await prisma.resource.count()

    console.log(`Incidents: ${incidentCount}, Assignments: ${assignmentCount}, Resources: ${resourceCount}`)

    if (incidentCount >= 10 && assignmentCount >= 10 && resourceCount >= 10) {
        fs.writeFileSync('SEED_SUCCESS.txt', `Verified at ${new Date().toISOString()}\nIncidents: ${incidentCount}\nAssignments: ${assignmentCount}\nResources: ${resourceCount}`)
    }
}

main()
    .catch((e) => {
        fs.writeFileSync('SEED_ERROR.txt', e.toString())
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
