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
import { createUser } from "./actions"
import { Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/components/i18n-provider"

interface CreateUserDialogProps {
    roles: any[]
    organizations: any[]
}

export function CreateUserDialog({ roles, organizations }: CreateUserDialogProps) {
    const { t } = useI18n()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await createUser(null, formData)

        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: t('users.create.success'),
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
                    {t('users.addUser')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('users.create.title')}</DialogTitle>
                        <DialogDescription>
                            {t('users.create.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t('users.table.name')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                {t('users.table.username')}
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                {t('login.password')}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                className="col-span-3"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                {t('users.table.role')}
                            </Label>
                            <Select name="roleId" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('users.table.role')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="org" className="text-right">
                                {t('users.table.organization')}
                            </Label>
                            <Select name="organizationId">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder={t('users.table.organization')} />
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
                            {t('users.create.title')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
