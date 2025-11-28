import { getIncidents } from "./actions"
import IncidentsClient from "./incidents-client"

export default async function IncidentsPage() {
    const { success, incidents } = await getIncidents()

    return (
        <>
            {success && incidents ? (
                <IncidentsClient incidents={incidents} />
            ) : (
                <div className="text-center py-10 text-red-500">Failed to load incidents</div>
            )}
        </>
    )
}
