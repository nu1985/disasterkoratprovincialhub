import { getIncidentDetails } from "./actions"
import IncidentDetailClient from "./incident-detail-client"
import prisma from "@/lib/prisma"

// Helper to get admin user for now (since we don't have full auth session in this context yet)
async function getCurrentUser() {
    return await prisma.user.findFirst({
        where: { role: { name: 'Admin' } }
    })
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { success, incident } = await getIncidentDetails(id)
    const currentUser = await getCurrentUser()

    if (!success || !incident) {
        return <div className="p-8 text-center text-red-500">Incident not found (ID: {id})</div>
    }

    return <IncidentDetailClient incident={incident} currentUser={currentUser} />
}
