'use server'

import prisma from "@/lib/prisma"

export async function getDashboardStats() {
    try {
        const totalIncidents = await prisma.incident.count()
        const activeIncidents = await prisma.incident.count({
            where: {
                status: {
                    in: ['NEW', 'VALIDATING', 'ASSIGNED', 'IN_PROGRESS']
                }
            }
        })
        const completedIncidents = await prisma.incident.count({
            where: { status: 'DONE' }
        })

        const incidentsByType = await prisma.incident.groupBy({
            by: ['incidentTypeId'],
            _count: {
                id: true
            }
        })

        // Fetch type names
        const types = await prisma.incidentType.findMany({
            where: {
                id: { in: incidentsByType.map(i => i.incidentTypeId) }
            }
        })

        const chartData = incidentsByType.map(item => {
            const type = types.find(t => t.id === item.incidentTypeId)
            return {
                name: type?.nameTh || type?.code || 'Unknown',
                value: item._count.id
            }
        })

        const recentActivity = await prisma.incident.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                incidentType: true,
                location: true
            }
        })

        return {
            success: true,
            stats: {
                total: totalIncidents,
                active: activeIncidents,
                completed: completedIncidents
            },
            chartData,
            recentActivity
        }
    } catch (error) {
        console.error("Failed to get dashboard stats:", error)
        return { success: false, message: "Failed to load stats" }
    }
}
