'use server'

import prisma from "@/lib/prisma"
import { AssignmentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getAssignmentDetails(id: string) {
    try {
        const assignment = await prisma.assignment.findUnique({
            where: { id },
            include: {
                incident: {
                    include: {
                        location: true,
                        incidentType: true,
                        reporter: true
                    }
                },
                unit: true
            }
        })
        if (!assignment) return { success: false, message: "Assignment not found" }
        return { success: true, assignment }
    } catch (error) {
        console.error("Failed to fetch assignment:", error)
        return { success: false, message: "Failed to load details" }
    }
}

export async function updateAssignmentStatus(id: string, status: AssignmentStatus, note?: string) {
    try {
        await prisma.assignment.update({
            where: { id },
            data: {
                status,
                note: note ? note : undefined, // Append or replace note logic could be here
                acceptedAt: status === 'ACCEPTED' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' ? new Date() : undefined
            }
        })

        // Also update incident status if needed (e.g. if assignment is IN_PROGRESS, incident is IN_PROGRESS)
        // Simplified logic for MVP
        if (status === 'IN_PROGRESS') {
            const assignment = await prisma.assignment.findUnique({ where: { id }, select: { incidentId: true } })
            if (assignment) {
                await prisma.incident.update({
                    where: { id: assignment.incidentId },
                    data: { status: 'IN_PROGRESS' }
                })
            }
        }

        revalidatePath(`/field/${id}`)
        revalidatePath(`/field`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update status:", error)
        return { success: false, message: "Update failed" }
    }
}
