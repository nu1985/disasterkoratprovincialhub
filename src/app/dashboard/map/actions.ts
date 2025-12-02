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
