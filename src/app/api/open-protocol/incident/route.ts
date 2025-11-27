import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const openProtocolSchema = z.object({
    external_id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    type: z.string(), // Code
    latitude: z.number(),
    longitude: z.number(),
    occurred_at: z.string().datetime().optional(),
    reporter: z.object({
        name: z.string().optional(),
        phone: z.string().optional()
    }).optional()
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validation = openProtocolSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid payload", details: validation.error }, { status: 400 })
        }

        const data = validation.data

        // Check for existing by external_id
        const existing = await prisma.incident.findFirst({
            where: { externalReferenceCode: data.external_id }
        })

        if (existing) {
            return NextResponse.json({ message: "Incident already exists", id: existing.id }, { status: 200 })
        }

        // Find or create type
        let type = await prisma.incidentType.findFirst({ where: { code: data.type } })
        if (!type) {
            type = await prisma.incidentType.create({
                data: { code: data.type, nameTh: data.type }
            })
        }

        // Create Location
        const location = await prisma.location.create({
            data: {
                province: "Nakhon Ratchasima", // Default
                district: "Unknown",
                subdistrict: "Unknown",
                latitude: data.latitude,
                longitude: data.longitude
            }
        })

        // Create Reporter if provided
        let reporterId = null
        if (data.reporter) {
            const reporter = await prisma.reporter.create({
                data: {
                    name: data.reporter.name,
                    phone: data.reporter.phone,
                    preferredChannel: "API"
                }
            })
            reporterId = reporter.id
        }

        // Create Incident
        const incident = await prisma.incident.create({
            data: {
                title: data.title,
                description: data.description,
                externalReferenceCode: data.external_id,
                incidentTypeId: type.id,
                locationId: location.id,
                reporterId: reporterId,
                latitude: data.latitude,
                longitude: data.longitude,
                occurredAt: data.occurred_at ? new Date(data.occurred_at) : undefined,
                status: "NEW",
                sourceChannelId: null // Could find API channel
            }
        })

        return NextResponse.json({ success: true, id: incident.id }, { status: 201 })

    } catch (error) {
        console.error("OpenProtocol Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
