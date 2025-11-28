'use server'

import prisma from "@/lib/prisma"

export async function getIncidentsForMap() {
    try {
        const incidents = await prisma.incident.findMany({
            where: {
                status: {
                    not: 'DONE' // Only show active incidents
                },
                location: {
                    isNot: null // Only show incidents with location
                }
            },
            include: {
                location: true,
                incidentType: true,
            },
        })
        return { incidents }
    } catch (error) {
        console.error("Failed to fetch incidents for map:", error)
        return { incidents: [] }
    }
}
