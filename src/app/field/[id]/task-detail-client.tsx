'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, User, CheckCircle, PlayCircle, ArrowRightCircle, Loader2 } from "lucide-react"
import { updateAssignmentStatus } from "./actions"

export default function TaskDetailClient({ assignment }: { assignment: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [note, setNote] = useState("")

    const handleStatusChange = async (status: any) => {
        setLoading(true)
        await updateAssignmentStatus(assignment.id, status, note)
        setLoading(false)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{assignment.incident.title}</CardTitle>
                        <Badge className="text-sm">{assignment.status}</Badge>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Assigned: {new Date(assignment.assignedAt).toLocaleString()}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-slate-600">
                                    {assignment.incident.location?.addressText}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {assignment.incident.location?.subdistrict}, {assignment.incident.location?.district}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500 shrink-0" />
                            <div>
                                <p className="font-medium">Reporter</p>
                                <p className="text-sm text-slate-600">{assignment.incident.reporter?.name || "Unknown"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-green-500 shrink-0" />
                            <div>
                                <p className="font-medium">Contact</p>
                                <a href={`tel:${assignment.incident.reporter?.phone}`} className="text-sm text-blue-600 underline">
                                    {assignment.incident.reporter?.phone || "-"}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-slate-700 text-sm">{assignment.incident.description}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Update Status</h3>
                        <Textarea
                            placeholder="Add a note (optional)..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mb-4"
                        />
                        <div className="grid grid-cols-1 gap-3">
                            {assignment.status === 'ASSIGNED' && (
                                <Button onClick={() => handleStatusChange('ACCEPTED')} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <ArrowRightCircle className="mr-2 h-4 w-4" /> Accept Task
                                </Button>
                            )}
                            {(assignment.status === 'ACCEPTED' || assignment.status === 'ASSIGNED') && (
                                <Button onClick={() => handleStatusChange('IN_PROGRESS')} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <PlayCircle className="mr-2 h-4 w-4" /> Start Operation
                                </Button>
                            )}
                            {assignment.status === 'IN_PROGRESS' && (
                                <Button onClick={() => handleStatusChange('COMPLETED')} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <CheckCircle className="mr-2 h-4 w-4" /> Complete Task
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
