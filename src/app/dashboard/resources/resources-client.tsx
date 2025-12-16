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

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload, FileSpreadsheet } from "lucide-react"
import * as XLSX from 'xlsx'
import { bulkCreateResources } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface ResourcesClientProps {
    resources: any[]
    organizations: any[]
}

export default function ResourcesClient({ resources, organizations }: ResourcesClientProps) {
    const { t } = useI18n()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isImporting, setIsImporting] = useState(false)

    const handleExport = () => {
        const data = resources.map(r => ({
            Name: r.name,
            Type: r.resourceType,
            Capacity: r.capacity || '',
            Status: r.status,
            OrganizationId: r.organizationId,
            OrganizationName: r.organization?.name || ''
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Resources")
        XLSX.writeFile(wb, "resources.xlsx")
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        const reader = new FileReader()
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)

                // Map Excel data to schema
                // Expected columns: Name, Type, Capacity, Status, OrganizationId
                const mappedData = data.map((row: any) => ({
                    name: row.Name || row.name,
                    type: row.Type || row.type,
                    capacity: row.Capacity || row.capacity,
                    status: row.Status || row.status,
                    organizationId: row.OrganizationId || row.organizationId || organizations[0]?.id // Fallback to first org if missing
                }))

                const result = await bulkCreateResources(mappedData)

                toast({
                    title: result.success ? t('common.success') : t('common.error'),
                    description: result.message,
                    variant: result.success ? "default" : "destructive",
                })
            } catch (error) {
                console.error("Import error:", error)
                toast({
                    title: t('common.error'),
                    description: "Failed to parse Excel file",
                    variant: "destructive",
                })
            } finally {
                setIsImporting(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        }
        reader.readAsBinaryString(file)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{t('resources.title')}</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx, .xls"
                        className="hidden"
                    />
                    <Button variant="outline" onClick={handleImportClick} disabled={isImporting}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isImporting ? 'Importing...' : 'Import Excel'}
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Excel
                    </Button>
                    <LanguageSwitcher />
                    <CreateResourceDialog organizations={organizations || []} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('resources.listTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
