import { PrismaClient, Severity, IncidentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Roles
    const roles = ['ADMIN', 'STAFF', 'VOLUNTEER']
    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: {
                name: roleName,
                description: `Role for ${roleName}`,
            },
        })
    }

    // 2. Create Default Organization
    const org = await prisma.organization.upsert({
        where: { id: 'default-org-id' }, // Use a fixed ID for simplicity in seed
        update: {},
        create: {
            id: 'default-org-id',
            name: 'Nakhon Ratchasima PAO',
            type: 'GOVERNMENT',
            contactPhone: '044-123-4567',
        },
    })

    // 3. Create Admin User
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } })
    if (adminRole) {
        const passwordHash = await bcrypt.hash('password', 10)
        await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                name: 'System Admin',
                username: 'admin',
                email: 'admin@korat.local',
                passwordHash,
                roleId: adminRole.id,
                organizationId: org.id,
                isActive: true,
            },
        })
    }

    // 4. Create Incident Types
    const incidentTypes = [
        { code: 'FLOOD', nameTh: 'น้ำท่วม', nameEn: 'Flood' },
        { code: 'FIRE', nameTh: 'อัคคีภัย', nameEn: 'Fire' },
        { code: 'STORM', nameTh: 'วาตภัย', nameEn: 'Storm' },
        { code: 'DROUGHT', nameTh: 'ภัยแล้ง', nameEn: 'Drought' },
        { code: 'ACCIDENT', nameTh: 'อุบัติเหตุ', nameEn: 'Accident' },
        { code: 'OTHER', nameTh: 'อื่นๆ', nameEn: 'Other' },
    ]

    for (const type of incidentTypes) {
        await prisma.incidentType.upsert({
            where: { code: type.code },
            update: {},
            create: {
                code: type.code,
                nameTh: type.nameTh,
                nameEn: type.nameEn,
            },
        })
    }


    // 5. Create Locations
    const locationsData = [
        { province: 'นครราชสีมา', district: 'เมืองนครราชสีมา', subdistrict: 'ในเมือง', addressText: 'หน้าลานย่าโม', lat: 14.9738, lng: 102.1030 },
        { province: 'นครราชสีมา', district: 'ปากช่อง', subdistrict: 'หมูสี', addressText: 'ทางขึ้นเขาใหญ่', lat: 14.5365, lng: 101.3995 },
        { province: 'นครราชสีมา', district: 'พิมาย', subdistrict: 'ในเมือง', addressText: 'อุทยานประวัติศาสตร์พิมาย', lat: 15.2222, lng: 102.4936 },
        { province: 'นครราชสีมา', district: 'วังน้ำเขียว', subdistrict: 'ไทยสามัคคี', addressText: 'ผาเก็บตะวัน', lat: 14.3312, lng: 101.8906 },
        { province: 'นครราชสีมา', district: 'ด่านขุนทด', subdistrict: 'ด่านขุนทด', addressText: 'วัดบ้านไร่', lat: 15.1158, lng: 101.7610 },
    ]

    const locationIds = []
    for (const loc of locationsData) {
        const createdLoc = await prisma.location.create({
            data: {
                province: loc.province,
                district: loc.district,
                subdistrict: loc.subdistrict,
                addressText: loc.addressText,
                latitude: loc.lat,
                longitude: loc.lng,
            }
        })
        locationIds.push(createdLoc.id)
    }

    // 6. Create Simulated Incidents
    const incidentData = [
        { title: 'น้ำท่วมขังถนนมิตรภาพ', desc: 'น้ำท่วมสูง 30 ซม. รถเล็กสัญจรลำบาก', typeCode: 'FLOOD', severity: 'MEDIUM', status: 'IN_PROGRESS', lat: 14.9750, lng: 102.1000 },
        { title: 'ไฟไหม้หญ้าข้างทาง', desc: 'ไฟไหม้ลุกลามวงกว้าง ใกล้ชุมชน', typeCode: 'FIRE', severity: 'HIGH', status: 'NEW', lat: 14.5400, lng: 101.4000 },
        { title: 'พายุพัดต้นไม้โค่นล้ม', desc: 'ต้นไม้ใหญ่ล้มขวางถนน กีดขวางการจราจร', typeCode: 'STORM', severity: 'MEDIUM', status: 'ASSIGNED', lat: 15.2250, lng: 102.4950 },
        { title: 'ภัยแล้งขาดแคลนน้ำ', desc: 'ชาวบ้านขาดแคลนน้ำอุปโภคบริโภค', typeCode: 'DROUGHT', severity: 'CRITICAL', status: 'NEW', lat: 14.3350, lng: 101.8950 },
        { title: 'อุบัติเหตุรถชนกัน 3 คัน', desc: 'รถเก๋งชนรถกระบะ มีผู้บาดเจ็บ 2 ราย', typeCode: 'ACCIDENT', severity: 'HIGH', status: 'IN_PROGRESS', lat: 15.1180, lng: 101.7650 },
        { title: 'ดินสไลด์ปิดเส้นทาง', desc: 'ฝนตกหนักดินสไลด์ รถผ่านไม่ได้', typeCode: 'OTHER', severity: 'MEDIUM', status: 'NEW', lat: 14.5380, lng: 101.4020 },
        { title: 'น้ำป่าไหลหลาก', desc: 'ประกาศเตือนภัยน้ำป่าไหลหลาก', typeCode: 'FLOOD', severity: 'CRITICAL', status: 'NEW', lat: 14.3380, lng: 101.8980 },
        { title: 'ไฟไหม้บ่อขยะ', desc: 'ควันพิษปกคลุมพื้นที่รอบข้าง', typeCode: 'FIRE', severity: 'MEDIUM', status: 'VALIDATING', lat: 14.9800, lng: 102.1050 },
        { title: 'หลังคาบ้านปลิวเสียหาย', desc: 'ลมพายุพัดหลังคาบ้านเรือนประชาชนเสียหาย 10 หลัง', typeCode: 'STORM', severity: 'LOW', status: 'DONE', lat: 15.2300, lng: 102.5000 },
        { title: 'ถนนทรุดตัว', desc: 'ผิวจราจรทรุดตัวเป็นหลุมลึก อันตราย', typeCode: 'ACCIDENT', severity: 'HIGH', status: 'ASSIGNED', lat: 15.1200, lng: 101.7700 },
        { title: 'ฝูงลิงรบกวนบ้านเรือน', desc: 'ลิงจากป่าเข้ามารื้อค้นอาหารในบ้านเรือน', typeCode: 'OTHER', severity: 'LOW', status: 'NEW', lat: 14.5420, lng: 101.4050 },
        { title: 'คลองส่งน้ำอุดตัน', desc: 'ผักตบชวาขวางทางน้ำไหล', typeCode: 'FLOOD', severity: 'LOW', status: 'NEW', lat: 15.2350, lng: 102.5050 },
    ]

    // Fetch type IDs map
    const typeIds: Record<string, string> = {}
    const types = await prisma.incidentType.findMany()
    types.forEach(t => typeIds[t.code] = t.id)

    // Helper to get random item
    const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    for (const data of incidentData) {
        // Randomly assign a location for variety in the "viewing" logic, although we set specific lat/long
        const locationId = getRandomItem(locationIds)

        await prisma.incident.create({
            data: {
                title: data.title,
                description: data.desc,
                incidentTypeId: typeIds[data.typeCode],
                severity: data.severity as any,
                status: data.status as any,
                latitude: data.lat,
                longitude: data.lng,
                locationId: locationId,
                // Assign reporter as the admin just for having user context if needed, or null
                // reporterId: ... 
            }
        })
    }


    console.log('Seeding finished.')

    // 7. Create 10 Organizations (plus the default one)
    const orgIds = [org.id]
    for (let i = 1; i <= 10; i++) {
        const newOrg = await prisma.organization.create({
            data: {
                name: `Organization ${i}`,
                type: 'NGO',
                contactPhone: `044-000-00${i}`,
                parentOrgId: org.id
            }
        })
        orgIds.push(newOrg.id)
    }

    // 8. Create 10 Units
    const unitIds = []
    for (let i = 1; i <= 10; i++) {
        const randomOrgId = getRandomItem(orgIds)
        const unit = await prisma.unit.create({
            data: {
                name: `Unit ${i}`,
                organizationId: randomOrgId,
                unitType: 'RESCUE',
                contactChannel: 'Radio 144.000',
                isActive: true
            }
        })
        unitIds.push(unit.id)
    }

    // 9. Create 10 Users (Staff/Volunteer)
    const userIds = []
    const staffRole = await prisma.role.upsert({ where: { name: 'STAFF' }, update: {}, create: { name: 'STAFF' } })
    const volunteerRole = await prisma.role.upsert({ where: { name: 'VOLUNTEER' }, update: {}, create: { name: 'VOLUNTEER' } })

    for (let i = 1; i <= 10; i++) {
        const roleId = i % 2 === 0 ? staffRole.id : volunteerRole.id
        const randomOrgId = getRandomItem(orgIds)
        const passwordHash = await bcrypt.hash('password', 10)

        const user = await prisma.user.create({
            data: {
                username: `user${i}`,
                name: `User ${i} Test`,
                email: `user${i}@example.com`,
                passwordHash,
                roleId: roleId,
                organizationId: randomOrgId,
                isActive: true
            }
        })
        userIds.push(user.id)
    }

    // 10. Create 10 Reporters
    const reporterIds = []
    for (let i = 1; i <= 10; i++) {
        const reporter = await prisma.reporter.create({
            data: {
                name: `Reporter ${i}`,
                phone: `081-000-00${i}`,
                lineId: `line_reporter_${i}`,
                isAnonymous: false
            }
        })
        reporterIds.push(reporter.id)
    }

    // 11. Create 10 Resources
    const resourceIds = []
    for (let i = 1; i <= 10; i++) {
        const randomOrgId = getRandomItem(orgIds)
        const randomLocId = getRandomItem(locationIds)
        const resource = await prisma.resource.create({
            data: {
                name: `Resource ${i} (Boat/Truck)`,
                resourceType: i % 2 === 0 ? 'VEHICLE' : 'EQUIPMENT',
                capacity: 10 + i,
                organizationId: randomOrgId,
                locationId: randomLocId,
                status: 'AVAILABLE'
            }
        })
        resourceIds.push(resource.id)
    }

    // 12. Create 10 Channels
    const channelIds = []
    for (let i = 1; i <= 10; i++) {
        const channel = await prisma.channel.create({
            data: {
                name: `Channel ${i}`,
                type: i % 2 === 0 ? 'LINE' : 'FACEBOOK',
                configJson: { pageId: 1000 + i }
            }
        })
        channelIds.push(channel.id)
    }

    // 13. Create 10 SyncEndpoints
    const syncEndpointIds = []
    for (let i = 1; i <= 10; i++) {
        const endpoint = await prisma.syncEndpoint.create({
            data: {
                name: `Endpoint ${i}`,
                direction: i % 2 === 0 ? 'INBOUND' : 'OUTBOUND',
                url: `https://api.partner${i}.com/sync`,
                authType: 'API_KEY'
            }
        })
        syncEndpointIds.push(endpoint.id)
    }

    // 14. Link Incidents to Assignments, SyncEvents, Attachments
    const allIncidents = await prisma.incident.findMany()

    // Create 10 Assignments distributed among incidents
    for (let i = 1; i <= 10; i++) {
        const randomIncident = getRandomItem(allIncidents)
        const randomUnit = getRandomItem(unitIds)
        await prisma.assignment.create({
            data: {
                incidentId: randomIncident.id,
                unitId: randomUnit,
                status: 'ASSIGNED',
                note: `Assignment ${i}`,
                assignedAt: new Date(),
            }
        })
    }

    // Create 10 Attachments
    for (let i = 1; i <= 10; i++) {
        const randomIncident = getRandomItem(allIncidents)
        await prisma.attachment.create({
            data: {
                incidentId: randomIncident.id,
                fileUrl: `https://example.com/file${i}.jpg`,
                fileType: 'IMAGE',
                createdAt: new Date()
            }
        })
    }

    // Create 10 SyncEvents
    for (let i = 1; i <= 10; i++) {
        const randomIncident = getRandomItem(allIncidents)
        const randomEndpoint = getRandomItem(syncEndpointIds)
        await prisma.syncEvent.create({
            data: {
                incidentId: randomIncident.id,
                syncEndpointId: randomEndpoint,
                eventType: 'UPDATE_STATUS',
                status: 'SUCCESS',
                payloadJson: { status: randomIncident.status }
            }
        })
    }

    // 15. Create EXTRA Sample data for the user request (10 items each)
    console.log('Creating 10 extra incidents...')
    const extraIncidentTitles = [
        'ท่อประปาแตกบริเวณสี่แยก', 'พบสัตว์ขาปล้องมีพิษในอาคาร', 'น้ำประปาไหลอ่อนหลายพื้นที่',
        'พบคราบน้ำมันบนผิวจราจร', 'สายไฟพาดผ่านกิ่งไม้ใกล้อาคาร', 'กลิ่นเหม็นจากกองขยะไม่พึงประสงค์',
        'ไฟฟ้าส่องสว่างดับหลายจุด', 'พบหลุมยุบบนฟุตบาท', 'ป้ายโฆษณาชำรุดเสี่ยงล้ม', 'ระบายน้ำอุดตันที่ตลาดสด'
    ]
    const extraIncidentIds = []
    for (let i = 0; i < 10; i++) {
        const type = getRandomItem(types)
        const locationId = getRandomItem(locationIds)
        const incident = await prisma.incident.create({
            data: {
                title: extraIncidentTitles[i] || `แจ้งเหตุพิเศษที่ ${i + 1}`,
                description: `รายละเอียดเพิ่มเติมเหตุพิเศษที่ ${i + 1}`,
                incidentTypeId: type.id,
                severity: getRandomItem(['LOW', 'MEDIUM', 'HIGH'] as Severity[]),
                status: getRandomItem(['NEW', 'VALIDATING', 'ASSIGNED', 'IN_PROGRESS'] as IncidentStatus[]),
                locationId: locationId,
                createdByUserId: getRandomItem(userIds),
            }
        })
        extraIncidentIds.push(incident.id)
    }

    console.log('Creating 10 extra resources...')
    const extraResourceNames = [
        'รถบรรทุกน้ำขนาดใหญ่', 'เครื่องสูบน้ำแรงดันสูง', 'เลื่อยยนต์ตัดไม้', 'ชุดปฐมพยาบาลเคลื่อนที่',
        'เรือเจ็ทสกีช่วยชีวิต', 'รถกระบะกู้ภัย 4x4', 'โดรนสำรวจความเสียหาย', 'เชือกช่วยชีวิตและรอก',
        'บันไดอลูมิเนียมยืดหดได้', 'วิทยุสื่อสารไอคอม'
    ]
    for (let i = 0; i < 10; i++) {
        await prisma.resource.create({
            data: {
                name: extraResourceNames[i],
                resourceType: i % 2 === 0 ? 'VEHICLE' : 'EQUIPMENT',
                capacity: 10 + i,
                organizationId: getRandomItem(orgIds),
                locationId: getRandomItem(locationIds),
                status: 'AVAILABLE'
            }
        })
    }

    console.log('Creating 10 extra assignments...')
    for (let i = 0; i < 10; i++) {
        await prisma.assignment.create({
            data: {
                incidentId: getRandomItem(extraIncidentIds),
                unitId: getRandomItem(unitIds),
                status: 'ASSIGNED',
                note: `งานมอบหมายพิเศษลำดับที่ ${i + 1}`,
                assignedAt: new Date(),
            }
        })
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
