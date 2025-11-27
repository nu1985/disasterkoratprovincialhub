import { getIncidentDetails } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, User, Calendar, Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function IncidentDetailPage({ params }: { params: { id: string } }) {
    const { success, incident } = await getIncidentDetails(params.id)

    if (!success || !incident) {
        return <div className="p-8 text-center text-red-500">Incident not found</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/incidents">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{incident.title}</h2>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="font-mono">{incident.id}</span>
                        <span>•</span>
                        <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Badge className="text-lg px-4 py-1">{incident.status}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Incident Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-1">Description</h3>
                                <p className="text-slate-700">{incident.description || "No description provided."}</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Type</h3>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-slate-500" />
                                        <span>{incident.incidentType?.nameTh || incident.incidentType?.code}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Location</h3>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        <span>{incident.location?.subdistrict}, {incident.location?.district}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 ml-6">{incident.location?.addressText}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Reporter Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <span>{incident.reporter?.name || "Anonymous"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                    <span>{incident.reporter?.phone || "-"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
                                {incident.statusHistory.map((history: any) => (
                                    <div key={history.id} className="relative pl-8">
                                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-4 ring-white"></div>
                                        <div>
                                            <div className="text-sm text-slate-500 mb-1">
                                                {new Date(history.changedAt).toLocaleString()}
                                            </div>
                                            <p className="font-medium text-slate-900">
                                                Status changed to <span className="font-bold">{history.newStatus}</span>
                                            </p>
                                            {history.changedByUser && (
                                                <p className="text-xs text-slate-400">by {history.changedByUser.name}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions & Assignments */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {incident.assignments.length > 0 ? (
                                <div className="space-y-4">
                                    {incident.assignments.map((assignment: any) => (
                                        <div key={assignment.id} className="border rounded p-3">
                                            <div className="font-medium">{assignment.unit.name}</div>
                                            <div className="text-sm text-slate-500">{assignment.status}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm">
                                    No units assigned yet.
                                </div>
                            )}
                            <Button className="w-full mt-4" variant="outline">Manage Assignments</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Map Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-400">
                                Map Placeholder
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
