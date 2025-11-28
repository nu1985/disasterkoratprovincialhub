import { getAssignments, getActiveIncidents, getAvailableResources } from "./actions"
import AssignmentsClient from "./assignments-client"

export default async function AssignmentsPage() {
    const { assignments } = await getAssignments()
    const { incidents } = await getActiveIncidents()
    const { resources } = await getAvailableResources()

    return (
        <AssignmentsClient
            assignments={assignments || []}
            incidents={incidents || []}
            resources={resources || []}
        />
    )
}
