import { getFieldAssignments } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function FieldTasksPage({ searchParams }: { searchParams: { unitId?: string } }) {
    const { success, assignments } = await getFieldAssignments(searchParams.unitId)

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">My Tasks</h2>

            {success && assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader className="pb-2 pt-4 px-4">
                            <div className="flex justify-between items-start">
                                <Badge variant={assignment.status === 'COMPLETED' ? 'secondary' : 'default'}>
                                    {assignment.status}
                                </Badge>
                                <span className="text-xs text-slate-400">
                                    {new Date(assignment.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <CardTitle className="text-lg mt-2">{assignment.incident.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4 px-4">
                            <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>
                                    {assignment.incident.location?.subdistrict}, {assignment.incident.location?.district}
                                </span>
                            </div>
                            <Link href={`/field/${assignment.id}`}>
                                <Button className="w-full" variant="outline">
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No tasks assigned.
                </div>
            )}
        </div>
    )
}
