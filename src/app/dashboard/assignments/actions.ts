'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const assignmentSchema = z.object({
    incidentId: z.string().min(1, "Incident is required"),
    resourceId: z.string().min(1, "Resource is required"),
})

export async function getAssignments() {
    try {
        const assignments = await prisma.assignment.findMany({
            include: {
                incident: {
                    include: {
                        incidentType: true
                    }
                },
                unit: true,
                resources: {
                    include: {
                        resource: true
                    }
                }
            },
            orderBy: {
                assignedAt: 'desc',
            },
        })
        return { assignments }
    } catch (error) {
        console.error("Failed to fetch assignments:", error)
        return { assignments: [] }
    }
}

export async function getActiveIncidents() {
    try {
        const incidents = await prisma.incident.findMany({
            where: {
                status: {
                    not: 'DONE'
                }
            },
            include: {
                incidentType: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { incidents }
    } catch (error) {
        console.error("Failed to fetch active incidents:", error)
        return { incidents: [] }
    }
}

export async function getAvailableResources() {
    try {
        const resources = await prisma.resource.findMany({
            where: {
                status: 'AVAILABLE'
            },
            orderBy: {
                name: 'asc'
            }
        })
        return { resources }
    } catch (error) {
        console.error("Failed to fetch available resources:", error)
        return { resources: [] }
    }
}

export async function createAssignment(prevState: any, formData: FormData) {
    try {
        const validatedFields = assignmentSchema.safeParse({
            incidentId: formData.get('incidentId'),
            resourceId: formData.get('resourceId'),
        })

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Invalid input",
            }
        }

        const { incidentId, resourceId } = validatedFields.data

        // Transaction to create assignment and update resource status
        await prisma.$transaction(async (tx) => {
            // 1. Get the resource to find its organization
            const resource = await tx.resource.findUnique({ where: { id: resourceId } })
            if (!resource) throw new Error("Resource not found")

            // 2. Find a suitable Unit in the same organization (or create a default one)
            // For simplicity, we'll try to find a 'RESPONSE_TEAM' unit or create one
            let unit = await tx.unit.findFirst({
                where: {
                    organizationId: resource.organizationId,
                    unitType: 'RESPONSE_TEAM'
                }
            })

            if (!unit) {
                // Fallback: Create a temporary unit for this assignment if none exists
                // Or find ANY unit
                unit = await tx.unit.findFirst({ where: { organizationId: resource.organizationId } })

                if (!unit) {
                    // Create a default unit for the organization
                    unit = await tx.unit.create({
                        data: {
                            name: "General Unit",
                            organizationId: resource.organizationId,
                            unitType: 'GENERAL',
                            isActive: true
                        }
                    })
                }
            }

            // 3. Create assignment linked to the Unit
            const assignment = await tx.assignment.create({
                data: {
                    incidentId,
                    unitId: unit.id,
                    status: 'ASSIGNED',
                    assignedAt: new Date(),
                },
            })

            // 4. Link the Resource to the Assignment
            await tx.assignmentResource.create({
                data: {
                    assignmentId: assignment.id,
                    resourceId: resource.id,
                    quantity: 1
                }
            })

            // 5. Update resource status to IN_USE
            await tx.resource.update({
                where: { id: resourceId },
                data: { status: 'IN_USE' },
            })
        })

        revalidatePath('/dashboard/assignments')
        revalidatePath('/dashboard/resources')
        return { success: true, message: 'Assignment created successfully' }
    } catch (error) {
        console.error("Failed to create assignment:", error)
        return { success: false, message: 'Failed to create assignment' }
    }
}
