'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { IncidentStatus } from "@prisma/client"

export async function getIncidents() {
    try {
        const incidents = await prisma.incident.findMany({
            orderBy: { reportedAt: 'desc' },
            take: 50,
            include: {
                incidentType: true,
                location: true,
                reporter: true
            }
        })
        return { success: true, incidents }
    } catch (error) {
        console.error("Failed to fetch incidents:", error)
        return { success: false, incidents: [] }
    }
}

export async function updateIncidentStatus(id: string, status: IncidentStatus) {
    try {
        await prisma.incident.update({
            where: { id },
            data: {
                status,
                statusHistory: {
                    create: {
                        newStatus: status,
                        // oldStatus would need fetching first, skipping for brevity in MVP
                        note: "Status updated via dashboard"
                    }
                }
            }
        })
        revalidatePath("/dashboard/incidents")
        return { success: true }
    } catch (error) {
        console.error("Failed to update status:", error)
        return { success: false, message: "Update failed" }
    }
}
