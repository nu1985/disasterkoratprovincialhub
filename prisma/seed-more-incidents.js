const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding more incidents (Thai)...')

    // Fetch Incident Types
    const types = await prisma.incidentType.findMany()
    const typeMap = types.reduce((acc, type) => {
        acc[type.code] = type.id
        return acc
    }, {})

    // Fetch Admin User
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } })
    if (!admin) {
        console.error('Admin user not found')
        return
    }

    const incidents = [
        {
            title: 'น้ำท่วมขังรอการระบาย หน้าตลาดแม่กิมเฮง',
            description: 'ฝนตกหนักต่อเนื่องทำให้น้ำท่วมขังสูงประมาณ 30 ซม. การจราจรติดขัด',
            type: 'FLOOD',
            severity: 'MEDIUM',
            status: 'NEW',
            lat: 14.9735,
            lng: 102.0828,
            location: { subdistrict: 'ในเมือง', district: 'เมืองนครราชสีมา', address: 'หน้าตลาดแม่กิมเฮง ถ.สุรนารี' }
        },
        {
            title: 'ไฟไหม้หญ้าข้างทาง ถ.มิตรภาพ',
            description: 'ไฟไหม้หญ้าแห้งเป็นวงกว้าง ควันไฟบดบังทัศนวิสัยการขับขี่',
            type: 'FIRE',
            severity: 'LOW',
            status: 'IN_PROGRESS',
            lat: 14.9950,
            lng: 102.1200,
            location: { subdistrict: 'จอหอ', district: 'เมืองนครราชสีมา', address: 'ริมถนนมิตรภาพ ขาออก' }
        },
        {
            title: 'พายุฤดูร้อนพัดถล่ม บ้านเรือนเสียหาย',
            description: 'ลมกระโชกแรงทำให้หลังคาบ้านเรือนประชาชนเสียหาย 5 หลังคาเรือน',
            type: 'STORM',
            severity: 'HIGH',
            status: 'NEW',
            lat: 15.2300,
            lng: 102.5000,
            location: { subdistrict: 'พิมาย', district: 'พิมาย', address: 'หมู่ 3 ต.ในเมือง' }
        },
        {
            title: 'ภัยแล้ง ขาดแคลนน้ำอุปโภคบริโภค',
            description: 'สระน้ำประปาหมู่บ้านแห้งขอด ชาวบ้านกว่า 100 หลังคาเรือนเดือดร้อน',
            type: 'DROUGHT',
            severity: 'CRITICAL',
            status: 'NEW',
            lat: 15.1500,
            lng: 101.7000,
            location: { subdistrict: 'ด่านขุนทด', district: 'ด่านขุนทด', address: 'บ้านหนองแวง' }
        },
        {
            title: 'อุบัติเหตุรถบรรทุกพลิกคว่ำ',
            description: 'รถบรรทุก 10 ล้อเสียหลักพลิกคว่ำ กีดขวางการจราจร 2 ช่องทาง',
            type: 'ACCIDENT',
            severity: 'HIGH',
            status: 'IN_PROGRESS',
            lat: 14.8500,
            lng: 102.0500,
            location: { subdistrict: 'ปักธงชัย', district: 'ปักธงชัย', address: 'ถนนสาย 304' }
        },
        {
            title: 'ดินสไลด์ปิดทับเส้นทาง',
            description: 'ฝนตกหนักทำให้ดินสไลด์ลงมาปิดทับถนน รถเล็กไม่สามารถสัญจรได้',
            type: 'OTHER', // Assuming LANDSLIDE maps to OTHER or similar if not exists
            severity: 'MEDIUM',
            status: 'NEW',
            lat: 14.5000,
            lng: 101.5000,
            location: { subdistrict: 'หมูสี', district: 'ปากช่อง', address: 'ทางขึ้นเขาใหญ่' }
        },
        {
            title: 'น้ำป่าไหลหลาก',
            description: 'น้ำป่าไหลหลากเข้าท่วมพื้นที่เกษตรกรรม เสียหายกว่า 50 ไร่',
            type: 'FLOOD',
            severity: 'HIGH',
            status: 'NEW',
            lat: 14.4500,
            lng: 101.9000,
            location: { subdistrict: 'วังน้ำเขียว', district: 'วังน้ำเขียว', address: 'บ้านไทยสามัคคี' }
        },
        {
            title: 'ไฟไหม้โรงงานรีไซเคิล',
            description: 'เพลิงไหม้กองพลาสติกในโรงงานรีไซเคิล ควบคุมเพลิงได้ยาก',
            type: 'FIRE',
            severity: 'CRITICAL',
            status: 'IN_PROGRESS',
            lat: 14.9000,
            lng: 102.2000,
            location: { subdistrict: 'หัวทะเล', district: 'เมืองนครราชสีมา', address: 'เขตอุตสาหกรรม' }
        },
        {
            title: 'พายุลูกเห็บตก',
            description: 'พายุลูกเห็บตกในพื้นที่ ทำให้พืชผลทางการเกษตรเสียหาย',
            type: 'STORM',
            severity: 'MEDIUM',
            status: 'DONE',
            lat: 15.3000,
            lng: 102.3000,
            location: { subdistrict: 'โนนสูง', district: 'โนนสูง', address: 'บ้านดอนหวาย' }
        },
        {
            title: 'รถกระบะชนเสาไฟฟ้า',
            description: 'รถกระบะเสียหลักชนเสาไฟฟ้าหักโค่น ไฟฟ้าดับเป็นวงกว้าง',
            type: 'ACCIDENT',
            severity: 'MEDIUM',
            status: 'DONE',
            lat: 14.9600,
            lng: 102.0500,
            location: { subdistrict: 'โคกกรวด', district: 'เมืองนครราชสีมา', address: 'ถนนมิตรภาพ สายเก่า' }
        },
        {
            title: 'สารเคมีรั่วไหล',
            description: 'รถบรรทุกสารเคมีรั่วไหลลงสู่แหล่งน้ำสาธารณะ',
            type: 'OTHER',
            severity: 'CRITICAL',
            status: 'NEW',
            lat: 15.0000,
            lng: 102.1500,
            location: { subdistrict: 'หนองระเวียง', district: 'เมืองนครราชสีมา', address: 'ใกล้มหาวิทยาลัย' }
        },
        {
            title: 'ฝุ่น PM 2.5 เกินค่ามาตรฐาน',
            description: 'ค่าฝุ่น PM 2.5 สูงเกินมาตรฐาน เริ่มมีผลกระทบต่อสุขภาพ',
            type: 'OTHER',
            severity: 'LOW',
            status: 'NEW',
            lat: 14.9700,
            lng: 102.1000,
            location: { subdistrict: 'ในเมือง', district: 'เมืองนครราชสีมา', address: 'ทั่วเขตเทศบาล' }
        }
    ]

    for (const inc of incidents) {
        // Create Location first
        const location = await prisma.location.create({
            data: {
                province: 'นครราชสีมา',
                district: inc.location.district,
                subdistrict: inc.location.subdistrict,
                addressText: inc.location.address,
                latitude: inc.lat,
                longitude: inc.lng
            }
        })

        // Create Incident
        await prisma.incident.create({
            data: {
                title: inc.title,
                description: inc.description,
                incidentType: { connect: { id: typeMap[inc.type] || typeMap['OTHER'] } },
                severity: inc.severity,
                status: inc.status,
                latitude: inc.lat,
                longitude: inc.lng,
                reportedAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)), // Random time in past
                location: { connect: { id: location.id } },
                createdByUser: { connect: { id: admin.id } },
                statusHistory: {
                    create: {
                        newStatus: inc.status,
                        changedByUserId: admin.id,
                        note: 'Initial seed data'
                    }
                }
            }
        })
    }

    console.log('Seeding completed.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
