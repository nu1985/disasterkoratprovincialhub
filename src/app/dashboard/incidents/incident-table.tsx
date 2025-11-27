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
import { MoreHorizontal, Eye, CheckCircle, XCircle, ArrowRightCircle } from "lucide-react"
import { updateIncidentStatus } from "./actions"
import { useRouter } from "next/navigation"

interface IncidentTableProps {
    incidents: any[]
}

export default function IncidentTable({ incidents }: IncidentTableProps) {
    const router = useRouter()
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
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reported At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell>{new Date(incident.reportedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loadingId === incident.id}>
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => router.push(`/dashboard/incidents/${incident.id}`)}>
                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'ASSIGNED')}>
                                            <ArrowRightCircle className="mr-2 h-4 w-4" /> Mark Assigned
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'IN_PROGRESS')}>
                                            <ArrowRightCircle className="mr-2 h-4 w-4" /> Mark In Progress
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'DONE')}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Done
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusUpdate(incident.id, 'INVALID')}>
                                            <XCircle className="mr-2 h-4 w-4" /> Mark Invalid
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
