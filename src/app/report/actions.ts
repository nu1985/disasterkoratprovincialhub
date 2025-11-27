'use server'

import { z } from "zod"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const reportSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    incidentType: z.string().min(1, "Incident Type is required"),
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    subdistrict: z.string().min(1, "Subdistrict is required"),
    address: z.string().optional(),
    reporterName: z.string().min(1, "Name is required"),
    reporterPhone: z.string().min(1, "Phone is required"),
})

export async function submitReport(prevState: any, formData: FormData) {
    const validatedFields = reportSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        incidentType: formData.get("incidentType"),
        province: formData.get("province"),
        district: formData.get("district"),
        subdistrict: formData.get("subdistrict"),
        address: formData.get("address"),
        reporterName: formData.get("reporterName"),
        reporterPhone: formData.get("reporterPhone"),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check your inputs.",
        }
    }

    const { title, description, incidentType, province, district, subdistrict, address, reporterName, reporterPhone } = validatedFields.data

    try {
        // 1. Create or find Reporter
        // For simplicity, we create a new reporter or find by phone if we had logic
        const reporter = await prisma.reporter.create({
            data: {
                name: reporterName,
                phone: reporterPhone,
                preferredChannel: "WEB",
            },
        })

        // 2. Create Location
        const location = await prisma.location.create({
            data: {
                province,
                district,
                subdistrict,
                addressText: address,
            },
        })

        // 3. Find Incident Type (Mocking ID or creating if not exists for now, ideally seeded)
        // We'll assume we pass the code or name, but schema expects ID.
        // For MVP, let's try to find by code or create a dummy one.
        let type = await prisma.incidentType.findFirst({ where: { code: incidentType } })
        if (!type) {
            // Create a default type if not found (just for safety in this MVP step)
            type = await prisma.incidentType.create({
                data: {
                    code: incidentType,
                    nameTh: incidentType, // Using the value as name
                }
            })
        }

        // 4. Create Incident
        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                incidentTypeId: type.id,
                locationId: location.id,
                reporterId: reporter.id,
                status: "NEW",
                sourceChannelId: null, // Web
            },
        })

        revalidatePath("/")
        return { success: true, message: "Report submitted successfully!", incidentId: incident.id }
    } catch (error) {
        console.error("Failed to submit report:", error)
        return { success: false, message: "Failed to submit report. Please try again." }
    }
}
