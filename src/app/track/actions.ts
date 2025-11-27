'use server'

import prisma from "@/lib/prisma"

export async function getIncidentStatus(id: string) {
    try {
        const incident = await prisma.incident.findUnique({
            where: { id },
            include: {
                statusHistory: {
                    orderBy: { changedAt: 'desc' }
                },
                location: true,
                incidentType: true
            }
        })

        if (!incident) {
            return { success: false, message: "Incident not found." }
        }

        return { success: true, incident }
    } catch (error) {
        console.error("Failed to get incident status:", error)
        return { success: false, message: "Failed to retrieve status." }
    }
}
