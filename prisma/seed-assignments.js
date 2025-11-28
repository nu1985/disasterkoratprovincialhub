const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding assignments...')

    // 1. Ensure Organization exists
    let org = await prisma.organization.findFirst({ where: { name: 'ศูนย์ป้องกันและบรรเทาสาธารณภัย นครราชสีมา' } })
    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: 'ศูนย์ป้องกันและบรรเทาสาธารณภัย นครราชสีมา',
                type: 'GOVERNMENT',
                contactAddress: 'ถ.สุรนารายณ์ อ.เมือง จ.นครราชสีมา'
            }
        })
        console.log('Created Organization:', org.name)
    }

    // 2. Ensure Units exist
    const unitNames = [
        'หน่วยเคลื่อนที่เร็ว 1',
        'หน่วยกู้ภัยสว่างเมตตา',
        'หน่วยดับเพลิงเทศบาล',
        'ทีมแพทย์ฉุกเฉิน รพ.มหาราช',
        'หน่วยบรรเทาทุกข์เคลื่อนที่'
    ]

    const units = []
    for (const name of unitNames) {
        let unit = await prisma.unit.findFirst({ where: { name } })
        if (!unit) {
            unit = await prisma.unit.create({
                data: {
                    name,
                    organizationId: org.id,
                    unitType: 'RESPONSE_TEAM',
                    isActive: true
                }
            })
            console.log('Created Unit:', unit.name)
        }
        units.push(unit)
    }

    // 3. Ensure Resources exist
    const resourceData = [
        { name: 'รถพยาบาลฉุกเฉิน 01', type: 'VEHICLE' },
        { name: 'รถดับเพลิง 05', type: 'VEHICLE' },
        { name: 'เรือท้องแบน', type: 'VEHICLE' },
        { name: 'เครื่องสูบน้ำขนาดใหญ่', type: 'EQUIPMENT' },
        { name: 'ชุดปฐมพยาบาลเบื้องต้น', type: 'SUPPLIES' },
        { name: 'ถุงยังชีพ 100 ชุด', type: 'SUPPLIES' },
        { name: 'โดรนสำรวจ', type: 'EQUIPMENT' },
        { name: 'รถกระบะยกสูง', type: 'VEHICLE' }
    ]

    const resources = []
    for (const res of resourceData) {
        let resource = await prisma.resource.findFirst({ where: { name: res.name } })
        if (!resource) {
            resource = await prisma.resource.create({
                data: {
                    name: res.name,
                    resourceType: res.type,
                    organizationId: org.id,
                    status: 'AVAILABLE',
                    capacity: 100
                }
            })
            console.log('Created Resource:', resource.name)
        }
        resources.push(resource)
    }

    // 4. Fetch Incidents and Admin User
    const incidents = await prisma.incident.findMany()
    if (incidents.length === 0) {
        console.error('No incidents found. Please run incident seed first.')
        return
    }

    const admin = await prisma.user.findUnique({ where: { username: 'admin' } })
    if (!admin) {
        console.error('Admin user not found')
        return
    }

    // 5. Create Assignments
    const statuses = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED']

    for (let i = 0; i < 10; i++) {
        const incident = incidents[Math.floor(Math.random() * incidents.length)]
        const unit = units[Math.floor(Math.random() * units.length)]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        // Create Assignment
        const assignment = await prisma.assignment.create({
            data: {
                incidentId: incident.id,
                unitId: unit.id,
                assignedByUserId: admin.id,
                status: status,
                note: `การมอบหมายงานทดสอบที่ ${i + 1}`,
                assignedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)) // Random time in last 24h
            }
        })

        // Assign random resource to this assignment
        const resource = resources[Math.floor(Math.random() * resources.length)]
        await prisma.assignmentResource.create({
            data: {
                assignmentId: assignment.id,
                resourceId: resource.id,
                quantity: 1
            }
        })

        // Update resource status if active
        if (status === 'ASSIGNED' || status === 'IN_PROGRESS') {
            await prisma.resource.update({
                where: { id: resource.id },
                data: { status: 'IN_USE' }
            })
        }

        console.log(`Created Assignment for Incident: ${incident.title} -> Unit: ${unit.name}`)
    }

    console.log('Seeding assignments completed.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
