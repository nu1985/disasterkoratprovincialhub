import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AssignmentsPage() {
    const assignments = await prisma.assignment.findMany({
        include: {
            incident: true,
            unit: true,
            assignedByUser: true
        },
        orderBy: { assignedAt: 'desc' },
        take: 50
    })

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                    <Card key={assignment.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{assignment.unit.name}</CardTitle>
                                <Badge variant={assignment.status === 'COMPLETED' ? 'secondary' : 'default'}>
                                    {assignment.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-slate-500">Incident:</span>
                                    <div className="font-medium truncate">{assignment.incident.title}</div>
                                </div>
                                <div>
                                    <span className="text-slate-500">Assigned By:</span>
                                    <div>{assignment.assignedByUser?.name || 'System'}</div>
                                </div>
                                <div>
                                    <span className="text-slate-500">Time:</span>
                                    <div>{new Date(assignment.assignedAt).toLocaleString()}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
