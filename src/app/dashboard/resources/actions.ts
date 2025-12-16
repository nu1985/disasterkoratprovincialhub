'use server'

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const resourceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    capacity: z.string().optional(),
    status: z.string().min(1, "Status is required"),
    organizationId: z.string().min(1, "Organization is required"),
})

export async function getResources() {
    try {
        const resources = await prisma.resource.findMany({
            include: {
                organization: true,
                location: true,
            },
            orderBy: {
                name: 'asc',
            },
        })
        return { resources }
    } catch (error) {
        console.error("Failed to fetch resources:", error)
        return { resources: [] }
    }
}

export async function createResource(prevState: any, formData: FormData) {
    try {
        const validatedFields = resourceSchema.safeParse({
            name: formData.get('name'),
            type: formData.get('type'),
            capacity: formData.get('capacity'),
            status: formData.get('status'),
            organizationId: formData.get('organizationId'),
        })

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Invalid input",
            }
        }

        const { name, type, capacity, status, organizationId } = validatedFields.data

        await prisma.resource.create({
            data: {
                name,
                resourceType: type,
                capacity: capacity ? parseFloat(capacity) : null,
                status: status as any,
                organizationId,
            },
        })

        revalidatePath('/dashboard/resources')
        return { success: true, message: 'Resource created successfully' }
    } catch (error) {
        console.error("Failed to create resource:", error)
        return { success: false, message: 'Failed to create resource' }
    }
}

export async function bulkCreateResources(resources: any[]) {
    try {
        let successCount = 0;
        let errorCount = 0;

        for (const res of resources) {
            // Validate input
            const validatedFields = resourceSchema.safeParse({
                name: res.name,
                type: res.type,
                capacity: res.capacity ? String(res.capacity) : undefined,
                status: res.status,
                organizationId: res.organizationId,
            })

            if (validatedFields.success) {
                const { name, type, capacity, status, organizationId } = validatedFields.data
                try {
                    await prisma.resource.create({
                        data: {
                            name,
                            resourceType: type,
                            capacity: capacity ? parseFloat(capacity) : null,
                            status: status as any,
                            organizationId,
                        },
                    })
                    successCount++;
                } catch (e) {
                    console.error("Error creating resource:", name, e)
                    errorCount++;
                }
            } else {
                errorCount++;
            }
        }

        revalidatePath('/dashboard/resources')
        return {
            success: true,
            message: `Import completed: ${successCount} success, ${errorCount} failed`,
            stats: { success: successCount, error: errorCount }
        }
    } catch (error) {
        console.error("Failed to bulk create resources:", error)
        return { success: false, message: 'Failed to process import' }
    }
}
