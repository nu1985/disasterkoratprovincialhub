import { PrismaClient, Severity, IncidentStatus, AssignmentStatus, ResourceStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding extra data...')

    // Fetch existing data to use as relations
    const incidentTypes = await prisma.incidentType.findMany()
    const organizations = await prisma.organization.findMany()
    const units = await prisma.unit.findMany()
    const locations = await prisma.location.findMany()
    const users = await prisma.user.findMany()

    if (incidentTypes.length === 0 || organizations.length === 0 || units.length === 0 || locations.length === 0 || users.length === 0) {
        console.error('Missing prerequisite data. Please run the main seed first.')
        process.exit(1)
    }

    const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    // 1. Create 10 more Incidents
    console.log('Creating 10 new incidents...')
    const newIncidentIds = []
    const incidentTitles = [
        'ท่อประปาแตกบริเวณสี่แยก',
        'พบสัตว์ขาปล้องมีพิษในอาคาร',
        'น้ำประปาไหลอ่อนหลายพื้นที่',
        'พบคราบน้ำมันบนผิวจราจร',
        'สายไฟพาดผ่านกิ่งไม้ใกล้อาคาร',
        'กลิ่นเหม็นจากกองขยะไม่พึงประสงค์',
        'ไฟฟ้าส่องสว่างดับหลายจุด',
        'พบหลุมยุบบนฟุตบาท',
        'ป้ายโฆษณาชำรุดเสี่ยงล้ม',
        'ระบายน้ำอุดตันที่ตลาดสด'
    ]

    for (let i = 0; i < 10; i++) {
        const type = getRandomItem(incidentTypes)
        const location = getRandomItem(locations)
        const user = getRandomItem(users)

        const incident = await prisma.incident.create({
            data: {
                title: incidentTitles[i] || `แจ้งเหตุที่ ${i + 1}`,
                description: `รายละเอียดเพิ่มเติมสำหรับเหตุที่ ${i + 1}`,
                incidentTypeId: type.id,
                severity: getRandomItem(['LOW', 'MEDIUM', 'HIGH'] as Severity[]),
                status: getRandomItem(['NEW', 'VALIDATING', 'ASSIGNED'] as IncidentStatus[]),
                locationId: location.id,
                latitude: location.latitude ? location.latitude + (Math.random() - 0.5) * 0.01 : undefined,
                longitude: location.longitude ? location.longitude + (Math.random() - 0.5) * 0.01 : undefined,
                createdByUserId: user.id,
            }
        })
        newIncidentIds.push(incident.id)
    }

    // 2. Create 10 more Resources
    console.log('Creating 10 new resources...')
    const resourceTypes = [
        { name: 'รถบรรทุกน้ำขนาดใหญ่', type: 'VEHICLE', cap: 5000 },
        { name: 'เครื่องสูบน้ำแรงดันสูง', type: 'EQUIPMENT', cap: 100 },
        { name: 'เลื่อยยนต์ตัดไม้', type: 'EQUIPMENT', cap: 5 },
        { name: 'ชุดปฐมพยาบาลเคลื่อนที่', type: 'EQUIPMENT', cap: 20 },
        { name: 'เรือเจ็ทสกีช่วยชีวิต', type: 'VEHICLE', cap: 2 },
        { name: 'รถกระบะกู้ภัย 4x4', type: 'VEHICLE', cap: 5 },
        { name: 'โดรนสำรวจความเสียหาย', type: 'EQUIPMENT', cap: 1 },
        { name: 'เชือกช่วยชีวิตและรอก', type: 'EQUIPMENT', cap: 10 },
        { name: 'บันไดอลูมิเนียมยืดหดได้', type: 'EQUIPMENT', cap: 1 },
        { name: 'วิทยุสื่อสารไอคอม', type: 'EQUIPMENT', cap: 1 }
    ]

    for (let i = 0; i < 10; i++) {
        const org = getRandomItem(organizations)
        const loc = getRandomItem(locations)
        const resDef = resourceTypes[i]

        await prisma.resource.create({
            data: {
                name: resDef.name,
                resourceType: resDef.type,
                capacity: resDef.cap,
                organizationId: org.id,
                locationId: loc.id,
                status: getRandomItem(['AVAILABLE', 'IN_USE'] as ResourceStatus[]),
            }
        })
    }

    // 3. Create 10 more Assignments
    console.log('Creating 10 new assignments...')
    for (let i = 0; i < 10; i++) {
        const incidentId = getRandomItem(newIncidentIds)
        const unit = getRandomItem(units)
        const user = getRandomItem(users)

        await prisma.assignment.create({
            data: {
                incidentId: incidentId,
                unitId: unit.id,
                assignedByUserId: user.id,
                status: getRandomItem(['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] as AssignmentStatus[]),
                note: `มอบหมายงานลำดับที่ ${i + 1} เพื่อดำเนินการตรวจสอบและแก้ไข`,
                assignedAt: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
            }
        })
    }

    console.log('Extra seeding completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
