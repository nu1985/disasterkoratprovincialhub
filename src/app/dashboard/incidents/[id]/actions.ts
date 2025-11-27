'use server'

import prisma from "@/lib/prisma"

export async function getIncidentDetails(id: string) {
    try {
        const incident = await prisma.incident.findUnique({
            where: { id },
            include: {
                incidentType: true,
                location: true,
                reporter: true,
                statusHistory: {
                    orderBy: { changedAt: 'desc' },
                    include: { changedByUser: true }
                },
                assignments: {
                    include: {
                        unit: true,
                        assignedByUser: true
                    }
                },
                attachments: true
            }
        })

        if (!incident) return { success: false, message: "Incident not found" }
        return { success: true, incident }
    } catch (error) {
        console.error("Failed to get incident details:", error)
        return { success: false, message: "Failed to load details" }
    }
}
