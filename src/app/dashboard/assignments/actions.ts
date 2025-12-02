'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const assignmentSchema = z.object({
    incidentId: z.string().min(1, "Incident is required"),
    resourceIds: z.array(z.string()).min(1, "At least one resource is required"),
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
        // Get all resourceId values from formData
        const resourceIds = formData.getAll('resourceId') as string[];

        const validatedFields = assignmentSchema.safeParse({
            incidentId: formData.get('incidentId'),
            resourceIds: resourceIds,
        })

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Invalid input",
            }
        }

        const { incidentId, resourceIds: validResourceIds } = validatedFields.data

        // Transaction to create assignment and update resource status
        await prisma.$transaction(async (tx) => {
            // 1. Get the first resource to find its organization
            const firstResource = await tx.resource.findUnique({ where: { id: validResourceIds[0] } })
            if (!firstResource) throw new Error("Resource not found")

            // 2. Find a suitable Unit in the same organization (or create a default one)
            let unit = await tx.unit.findFirst({
                where: {
                    organizationId: firstResource.organizationId,
                    unitType: 'RESPONSE_TEAM'
                }
            })

            if (!unit) {
                unit = await tx.unit.findFirst({ where: { organizationId: firstResource.organizationId } })

                if (!unit) {
                    unit = await tx.unit.create({
                        data: {
                            name: "General Unit",
                            organizationId: firstResource.organizationId,
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

            // 4. Link Resources to the Assignment and update their status
            for (const resId of validResourceIds) {
                await tx.assignmentResource.create({
                    data: {
                        assignmentId: assignment.id,
                        resourceId: resId,
                        quantity: 1
                    }
                })

                await tx.resource.update({
                    where: { id: resId },
                    data: { status: 'IN_USE' },
                })
            }
        })

        revalidatePath('/dashboard/assignments')
        revalidatePath('/dashboard/resources')
        return { success: true, message: 'Assignment created successfully' }
    } catch (error) {
        console.error("Failed to create assignment:", error)
        return { success: false, message: 'Failed to create assignment' }
    }
}

const updateAssignmentSchema = z.object({
    id: z.string().min(1, "ID is required"),
    incidentId: z.string().min(1, "Incident is required"),
    resourceIds: z.array(z.string()).min(1, "At least one resource is required"),
    status: z.enum(['PENDING', 'ASSIGNED', 'ON_SITE', 'COMPLETED', 'CANCELLED']),
})

export async function updateAssignment(prevState: any, formData: FormData) {
    try {
        const resourceIds = formData.getAll('resourceId') as string[];

        const validatedFields = updateAssignmentSchema.safeParse({
            id: formData.get('id'),
            incidentId: formData.get('incidentId'),
            resourceIds: resourceIds,
            status: formData.get('status'),
        })

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Invalid input",
            }
        }

        const { id, incidentId, resourceIds: newResourceIds, status } = validatedFields.data

        await prisma.$transaction(async (tx) => {
            // 1. Get current assignment to check for changes
            const currentAssignment = await tx.assignment.findUnique({
                where: { id },
                include: { resources: true }
            })

            if (!currentAssignment) throw new Error("Assignment not found")

            const currentResourceIds = currentAssignment.resources.map(r => r.resourceId)

            // 2. Handle Resource Changes

            // Resources to remove: present in current but not in new
            const toRemove = currentResourceIds.filter(rid => !newResourceIds.includes(rid))

            // Resources to add: present in new but not in current
            const toAdd = newResourceIds.filter(rid => !currentResourceIds.includes(rid))

            // Remove old links and mark as AVAILABLE
            if (toRemove.length > 0) {
                await tx.resource.updateMany({
                    where: { id: { in: toRemove } },
                    data: { status: 'AVAILABLE' }
                })

                await tx.assignmentResource.deleteMany({
                    where: {
                        assignmentId: id,
                        resourceId: { in: toRemove }
                    }
                })
            }

            // Add new links and mark as IN_USE
            for (const resId of toAdd) {
                await tx.assignmentResource.create({
                    data: {
                        assignmentId: id,
                        resourceId: resId,
                        quantity: 1
                    }
                })

                await tx.resource.update({
                    where: { id: resId },
                    data: { status: 'IN_USE' },
                })
            }

            // 3. Handle Status Change
            // If status is COMPLETED or CANCELLED, release ALL resources
            if (status === 'COMPLETED' || status === 'CANCELLED') {
                await tx.resource.updateMany({
                    where: { id: { in: newResourceIds } },
                    data: { status: 'AVAILABLE' }
                })
            } else if (status !== 'COMPLETED' && status !== 'CANCELLED' && (currentAssignment.status === 'COMPLETED' || currentAssignment.status === 'CANCELLED')) {
                // If moving FROM completed/cancelled TO active, mark resources as IN_USE again
                await tx.resource.updateMany({
                    where: { id: { in: newResourceIds } },
                    data: { status: 'IN_USE' }
                })
            }

            await tx.assignment.update({
                where: { id },
                data: {
                    incidentId,
                    status: status as any,
                }
            })
        })

        revalidatePath('/dashboard/assignments')
        revalidatePath('/dashboard/resources')
        return { success: true, message: 'Assignment updated successfully' }
    } catch (error) {
        console.error("Failed to update assignment:", error)
        return { success: false, message: 'Failed to update assignment' }
    }
}
