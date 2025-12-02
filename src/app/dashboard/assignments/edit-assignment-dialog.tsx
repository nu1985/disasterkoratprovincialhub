'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateAssignment } from "./actions"
import { Loader2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/components/i18n-provider"

interface EditAssignmentDialogProps {
    assignment: any
    incidents: any[]
    resources: any[]
}

export function EditAssignmentDialog({ assignment, incidents, resources }: EditAssignmentDialogProps) {
    const { t } = useI18n()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    // We need to include the currently assigned resources in the list even if they are not AVAILABLE
    // otherwise they won't be shown
    const currentResourceIds = assignment.resources.map((ar: any) => ar.resourceId)
    const currentResources = assignment.resources.map((ar: any) => ar.resource)

    // Combine available resources with the current ones if they are not already in the list
    const allResourcesMap = new Map()
    resources.forEach(r => allResourcesMap.set(r.id, r))
    currentResources.forEach((r: any) => {
        if (r) allResourcesMap.set(r.id, r)
    })
    const allResources = Array.from(allResourcesMap.values())

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append('id', assignment.id)

        const result = await updateAssignment(null, formData)

        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: "Assignment updated successfully",
            })
            setOpen(false)
        } else {
            toast({
                title: t('common.error'),
                description: result.message || t('common.error'),
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('assignments.edit.title') || "Edit Assignment"}</DialogTitle>
                        <DialogDescription>
                            {t('assignments.edit.description') || "Update assignment details."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="incident" className="text-right">
                                {t('assignments.table.incident')}
                            </Label>
                            <Select name="incidentId" defaultValue={assignment.incidentId} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('assignments.create.selectIncident')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {incidents.map((incident) => (
                                        <SelectItem key={incident.id} value={incident.id}>
                                            {incident.title} ({incident.incidentType.nameTh})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right self-start pt-2">
                                {t('assignments.table.resource')}
                            </Label>
                            <div className="col-span-3 border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
                                {allResources.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">No available resources</p>
                                ) : allResources.map((resource) => (
                                    <div key={resource.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`edit-resource-${resource.id}`}
                                            name="resourceId"
                                            value={resource.id}
                                            defaultChecked={currentResourceIds.includes(resource.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label
                                            htmlFor={`edit-resource-${resource.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {resource.name} <span className="text-muted-foreground text-xs">({resource.resourceType})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                {t('assignments.table.status')}
                            </Label>
                            <Select name="status" defaultValue={assignment.status} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">{t('assignments.statuses.PENDING') || "Pending"}</SelectItem>
                                    <SelectItem value="ASSIGNED">{t('assignments.statuses.ASSIGNED') || "Assigned"}</SelectItem>
                                    <SelectItem value="ON_SITE">{t('assignments.statuses.ON_SITE') || "On Site"}</SelectItem>
                                    <SelectItem value="COMPLETED">{t('assignments.statuses.COMPLETED') || "Completed"}</SelectItem>
                                    <SelectItem value="CANCELLED">{t('assignments.statuses.CANCELLED') || "Cancelled"}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('common.save') || "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
