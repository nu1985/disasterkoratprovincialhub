'use client'

import { useState } from "react"
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
import { createAssignment } from "./actions"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/components/i18n-provider"

interface CreateAssignmentDialogProps {
    incidents: any[]
    resources: any[]
}

export function CreateAssignmentDialog({ incidents, resources }: CreateAssignmentDialogProps) {
    const { t } = useI18n()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await createAssignment(null, formData)

        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: t('assignments.create.success'),
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
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('assignments.create.title')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('assignments.create.title')}</DialogTitle>
                        <DialogDescription>
                            {t('assignments.create.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="incident" className="text-right">
                                {t('assignments.table.incident')}
                            </Label>
                            <Select name="incidentId" required>
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
                            <Label htmlFor="resource" className="text-right">
                                {t('assignments.table.resource')}
                            </Label>
                            <Select name="resourceId" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('assignments.create.selectResource')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {resources.map((resource) => (
                                        <SelectItem key={resource.id} value={resource.id}>
                                            {resource.name} ({resource.resourceType})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('assignments.create.title')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
