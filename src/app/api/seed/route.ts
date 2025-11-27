import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        console.log('Start seeding via API ...')

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
            where: { id: 'default-org-id' },
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

        return NextResponse.json({ message: 'Seeding finished successfully' })
    } catch (error) {
        console.error('Seeding failed:', error)
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 })
    }
}
