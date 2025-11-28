'use client'

import { CreateResourceDialog } from "./create-resource-dialog"
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

interface ResourcesClientProps {
    resources: any[]
    organizations: any[]
}

export default function ResourcesClient({ resources, organizations }: ResourcesClientProps) {
    const { t } = useI18n()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{t('resources.title')}</h2>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <CreateResourceDialog organizations={organizations || []} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('resources.listTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('resources.table.name')}</TableHead>
                                <TableHead>{t('resources.table.type')}</TableHead>
                                <TableHead>{t('resources.table.capacity')}</TableHead>
                                <TableHead>{t('resources.table.status')}</TableHead>
                                <TableHead>{t('resources.table.organization')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resources?.map((resource) => (
                                <TableRow key={resource.id}>
                                    <TableCell className="font-medium">{resource.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {t(`resources.types.${resource.resourceType}` as any) || resource.resourceType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{resource.capacity || '-'}</TableCell>
                                    <TableCell>
                                        <Badge className={
                                            resource.status === 'AVAILABLE' ? 'bg-green-500' :
                                                resource.status === 'IN_USE' ? 'bg-blue-500' :
                                                    'bg-yellow-500'
                                        }>
                                            {t(`resources.statuses.${resource.status}` as any) || resource.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{resource.organization?.name || '-'}</TableCell>
                                </TableRow>
                            ))}
                            {(!resources || resources.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No resources found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
