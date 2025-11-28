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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createResource } from "./actions"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/components/i18n-provider"

interface CreateResourceDialogProps {
    organizations: any[]
}

export function CreateResourceDialog({ organizations }: CreateResourceDialogProps) {
    const { t } = useI18n()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await createResource(null, formData)

        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: t('resources.create.success'),
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
                    {t('resources.addResource')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('resources.create.title')}</DialogTitle>
                        <DialogDescription>
                            {t('resources.create.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t('resources.table.name')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Fire Truck 01"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                {t('resources.table.type')}
                            </Label>
                            <Select name="type" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('resources.table.type')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VEHICLE">{t('resources.types.VEHICLE')}</SelectItem>
                                    <SelectItem value="EQUIPMENT">{t('resources.types.EQUIPMENT')}</SelectItem>
                                    <SelectItem value="SUPPLIES">{t('resources.types.SUPPLIES')}</SelectItem>
                                    <SelectItem value="PERSONNEL">{t('resources.types.PERSONNEL')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">
                                {t('resources.table.capacity')}
                            </Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                placeholder="1"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                {t('resources.table.status')}
                            </Label>
                            <Select name="status" required defaultValue="AVAILABLE">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('resources.table.status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVAILABLE">{t('resources.statuses.AVAILABLE')}</SelectItem>
                                    <SelectItem value="IN_USE">{t('resources.statuses.IN_USE')}</SelectItem>
                                    <SelectItem value="MAINTENANCE">{t('resources.statuses.MAINTENANCE')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="org" className="text-right">
                                {t('resources.table.organization')}
                            </Label>
                            <Select name="organizationId" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('resources.table.organization')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('resources.create.title')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
