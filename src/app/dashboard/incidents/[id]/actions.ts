'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getIncidentDetails(id: string) {
    try {
        const incident = await prisma.incident.findUnique({
            where: { id },
            include: {
                incidentType: true,
                location: true,
                reporter: true,
                statusHistory: {
                    include: {
                        changedByUser: true
                    },
                    orderBy: {
                        changedAt: 'desc'
                    }
                },
                assignments: {
                    include: {
                        unit: true
                    },
                    orderBy: {
                        assignedAt: 'desc'
                    }
                }
            }
        })
        return { success: true, incident }
    } catch (error) {
        console.error("Failed to fetch incident details:", error)
        return { success: false, incident: null }
    }
}

export async function updateIncidentStatus(incidentId: string, newStatus: string, userId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // Update incident status
            await tx.incident.update({
                where: { id: incidentId },
                data: { status: newStatus as any },
            })

            // Create status history record
            await tx.incidentStatusHistory.create({
                data: {
                    incidentId,
                    newStatus: newStatus as any,
                    changedByUserId: userId, // Assuming we have the user ID
                },
            })
        })

        revalidatePath(`/dashboard/incidents/${incidentId}`)
        revalidatePath('/dashboard/incidents')
        return { success: true, message: 'Status updated successfully' }
    } catch (error) {
        console.error("Failed to update incident status:", error)
        return { success: false, message: 'Failed to update status' }
    }
}
