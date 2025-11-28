'use client'

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Eye, CheckCircle, XCircle, ArrowRightCircle } from "lucide-react"
import { updateIncidentStatus } from "./actions"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"

interface IncidentsClientProps {
    incidents: any[]
}

export default function IncidentsClient({ incidents }: IncidentsClientProps) {
    const router = useRouter()
    const { t } = useI18n()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusUpdate = async (id: string, status: any) => {
        setLoadingId(id)
        await updateIncidentStatus(id, status)
        setLoadingId(null)
        router.refresh()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-red-500 hover:bg-red-600'
            case 'VALIDATING': return 'bg-orange-500 hover:bg-orange-600'
            case 'ASSIGNED': return 'bg-blue-500 hover:bg-blue-600'
            case 'IN_PROGRESS': return 'bg-indigo-500 hover:bg-indigo-600'
            case 'DONE': return 'bg-green-500 hover:bg-green-600'
            default: return 'bg-slate-500 hover:bg-slate-600'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{t('incidents.title')}</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('incidents.recentIncidents')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('incidents.table.id')}</TableHead>
                                    <TableHead>{t('incidents.table.title')}</TableHead>
                                    <TableHead>{t('incidents.table.type')}</TableHead>
                                    <TableHead>{t('incidents.table.location')}</TableHead>
                                    <TableHead>{t('incidents.table.status')}</TableHead>
                                    <TableHead>{t('incidents.table.reportedAt')}</TableHead>
                                    <TableHead className="text-right">{t('incidents.table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incidents.map((incident) => (
                                    <TableRow key={incident.id}>
                                        <TableCell className="font-mono text-xs">{incident.id.substring(0, 8)}...</TableCell>
                                        <TableCell className="font-medium">{incident.title}</TableCell>
                                        <TableCell>{incident.incidentType?.nameTh || incident.incidentType?.code}</TableCell>
                                        <TableCell>{incident.location?.district}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(incident.status)}>
                                                {incident.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(incident.reportedAt).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={loadingId === incident.id}>
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('incidents.table.actions')}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" /> {t('incidents.actions.viewDetails')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuLabel>{t('incidents.actions.updateStatus')}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'ASSIGNED')}>
                                                        <ArrowRightCircle className="mr-2 h-4 w-4" /> {t('incidents.actions.markAssigned')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'IN_PROGRESS')}>
                                                        <ArrowRightCircle className="mr-2 h-4 w-4" /> {t('incidents.actions.markInProgress')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'DONE')}>
                                                        <CheckCircle className="mr-2 h-4 w-4" /> {t('incidents.actions.markDone')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'INVALID')}>
                                                        <XCircle className="mr-2 h-4 w-4" /> {t('incidents.actions.markInvalid')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
