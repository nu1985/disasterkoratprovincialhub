const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
    console.log('Seeding users and roles...')

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
    }

    // 2. Create Roles
    const roles = [
        { name: 'ADMIN', description: 'Administrator with full access' },
        { name: 'STAFF', description: 'Staff member with standard access' },
        { name: 'VOLUNTEER', description: 'Volunteer with limited access' },
        { name: 'COORDINATOR', description: 'Coordinator for managing resources' }
    ]

    const roleMap = {}

    for (const r of roles) {
        let role = await prisma.role.findUnique({ where: { name: r.name } })
        if (!role) {
            role = await prisma.role.create({
                data: r
            })
            console.log('Created Role:', role.name)
        }
        roleMap[r.name] = role.id
    }

    // 3. Create Users
    const passwordHash = await bcrypt.hash('password123', 10)

    const users = [
        {
            name: 'สมชาย ใจดี',
            username: 'somchai',
            email: 'somchai@example.com',
            role: 'ADMIN',
            phone: '081-111-1111'
        },
        {
            name: 'วิภาดา รักงาน',
            username: 'wipada',
            email: 'wipada@example.com',
            role: 'STAFF',
            phone: '082-222-2222'
        },
        {
            name: 'อำพล คนขยัน',
            username: 'amphon',
            email: 'amphon@example.com',
            role: 'VOLUNTEER',
            phone: '083-333-3333'
        },
        {
            name: 'ประสิทธิ์ กิจการ',
            username: 'prasit',
            email: 'prasit@example.com',
            role: 'COORDINATOR',
            phone: '084-444-4444'
        },
        {
            name: 'กานดา มานะ',
            username: 'kanda',
            email: 'kanda@example.com',
            role: 'STAFF',
            phone: '085-555-5555'
        }
    ]

    for (const u of users) {
        const exists = await prisma.user.findUnique({ where: { username: u.username } })
        if (!exists) {
            await prisma.user.create({
                data: {
                    name: u.name,
                    username: u.username,
                    email: u.email,
                    passwordHash,
                    roleId: roleMap[u.role],
                    organizationId: org.id,
                    phone: u.phone,
                    isActive: true
                }
            })
            console.log('Created User:', u.name)
        }
    }

    console.log('Seeding users completed.')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
