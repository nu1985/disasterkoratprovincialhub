'use server'

import prisma from "@/lib/prisma"

export async function getFieldAssignments(unitId?: string) {
    try {
        // If no unitId, fetch all for demo purposes
        const where = unitId ? { unitId } : {}

        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                incident: {
                    include: {
                        location: true,
                        incidentType: true
                    }
                }
            },
            orderBy: { assignedAt: 'desc' }
        })
        return { success: true, assignments }
    } catch (error) {
        console.error("Failed to fetch field assignments:", error)
        return { success: false, assignments: [] }
    }
}
