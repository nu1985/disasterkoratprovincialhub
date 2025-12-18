'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, User, AlertTriangle, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { updateIncidentStatus } from "./actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import MapWrapper from "../../map/map-wrapper"
import { useI18n } from "@/components/i18n-provider"

interface IncidentDetailClientProps {
    incident: any
    currentUser: any // We need the current user for the history log
}

export default function IncidentDetailClient({ incident, currentUser }: IncidentDetailClientProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const { t } = useI18n()

    async function handleStatusUpdate(newStatus: string) {
        if (!currentUser) {
            toast({
                title: t('common.error'),
                description: "You must be logged in to update status.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        const result = await updateIncidentStatus(incident.id, newStatus, currentUser.id)
        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: `${t('incidentDetail.statusChangedTo')} ${newStatus}`,
            })
            router.refresh()
        } else {
            toast({
                title: t('common.error'),
                description: result.message,
                variant: "destructive",
            })
        }
    }

    // Prepare incident data for map wrapper (it expects an array)
    const mapIncidents = [incident]

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
                <div className="ml-auto flex gap-2">
                    <Badge className={`text-lg px-4 py-1 ${incident.status === 'NEW' ? 'bg-red-500' :
                        incident.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                            incident.status === 'DONE' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                        {incident.status}
                    </Badge>
                </div>
            </div>

            {/* Status Actions */}
            {incident.status !== 'DONE' && incident.status !== 'CANCELLED' && (
                <Card>
                    <CardContent className="p-4 flex gap-4 items-center">
                        <span className="font-semibold text-sm">{t('incidentDetail.updateStatus')}:</span>
                        {incident.status === 'NEW' && (
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                disabled={isLoading}
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                {t('incidentDetail.acknowledge')}
                            </Button>
                        )}
                        {incident.status === 'IN_PROGRESS' && (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate('DONE')}
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t('incidentDetail.resolve')}
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate('CANCELLED')}
                            disabled={isLoading}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            {t('incidentDetail.cancel')}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('incidentDetail.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-1">{t('incidentDetail.description')}</h3>
                                <p className="text-slate-700">{incident.description || t('incidentDetail.noDescription')}</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-1">{t('incidentDetail.type')}</h3>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-slate-500" />
                                        <span>{incident.incidentType?.nameTh || incident.incidentType?.code}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{t('incidentDetail.location')}</h3>
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
                            <CardTitle>{t('incidentDetail.reporterInfo')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <span>{incident.reporter?.name || t('incidentDetail.anonymous')}</span>
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
                            <CardTitle>{t('incidentDetail.timeline')}</CardTitle>
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
                                                {t('incidentDetail.statusChangedTo')} <span className="font-bold">{history.newStatus}</span>
                                            </p>
                                            {history.changedByUser && (
                                                <p className="text-xs text-slate-400">{t('incidentDetail.by')} {history.changedByUser.name}</p>
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
                            <CardTitle>{t('incidentDetail.assignments')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {incident.assignments.length > 0 ? (
                                <div className="space-y-4">
                                    {incident.assignments.map((assignment: any) => (
                                        <div key={assignment.id} className="border rounded p-3">
                                            <div className="font-medium">{assignment.unit?.name || t('incidentDetail.unknownUnit')}</div>
                                            <div className="text-sm text-slate-500">{assignment.status}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {t('incidentDetail.assigned')}: {new Date(assignment.assignedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm">
                                    {t('incidentDetail.noAssignments')}
                                </div>
                            )}
                            <Link href="/dashboard/assignments">
                                <Button className="w-full mt-4" variant="outline">{t('incidentDetail.manageAssignments')}</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('incidentDetail.mapLocation')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden h-64">
                            <MapWrapper incidents={mapIncidents} resources={[]} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
