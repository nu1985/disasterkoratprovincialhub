'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreateAssignmentDialog } from "./create-assignment-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/i18n-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

interface AssignmentsClientProps {
    assignments: any[]
    incidents: any[]
    resources: any[]
}

export default function AssignmentsClient({ assignments, incidents, resources }: AssignmentsClientProps) {
    const { t, language } = useI18n()
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 30000) // Refresh every 30 seconds

        return () => clearInterval(interval)
    }, [router])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{t('assignments.title')}</h2>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <CreateAssignmentDialog incidents={incidents || []} resources={resources || []} />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t('assignments.listTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('assignments.table.incident')}</TableHead>
                                    <TableHead>{t('assignments.table.resource')}</TableHead>
                                    <TableHead>{t('assignments.table.status')}</TableHead>
                                    <TableHead>{t('assignments.table.assignedAt')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments?.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell className="font-medium">{assignment.incident.title}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold">{assignment.unit.name}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {assignment.resources.map((ar: any) => (
                                                        <Badge key={ar.id} variant="secondary" className="text-xs">
                                                            {ar.resource.name} ({ar.quantity})
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                assignment.status === 'ASSIGNED' ? 'bg-blue-500' :
                                                    assignment.status === 'COMPLETED' ? 'bg-green-500' :
                                                        'bg-gray-500'
                                            }>
                                                {t(`assignments.statuses.${assignment.status}` as any) || assignment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(assignment.assignedAt).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}</TableCell>
                                    </TableRow>
                                ))}
                                {(!assignments || assignments.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No assignments found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
