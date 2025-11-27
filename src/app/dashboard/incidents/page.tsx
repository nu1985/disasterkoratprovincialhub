import { getIncidents } from "./actions"
import IncidentTable from "./incident-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function IncidentsPage() {
    const { success, incidents } = await getIncidents()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Incidents</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                    {success && incidents ? (
                        <IncidentTable incidents={incidents} />
                    ) : (
                        <div className="text-center py-10 text-red-500">Failed to load incidents</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
