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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateUser } from "./actions"
import { Loader2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/components/i18n-provider"

interface EditUserDialogProps {
    user: any
    roles: any[]
    organizations: any[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ user, roles, organizations, open, onOpenChange }: EditUserDialogProps) {
    const { t } = useI18n()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        formData.append("id", user.id)

        const result = await updateUser(null, formData)

        setIsLoading(false)

        if (result.success) {
            toast({
                title: t('common.success'),
                description: t('users.update.success') || "User updated successfully",
            })
            onOpenChange(false)
        } else {
            toast({
                title: t('common.error'),
                description: result.message || t('common.error'),
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('users.edit.title') || "Edit User"}</DialogTitle>
                        <DialogDescription>
                            {t('users.edit.description') || "Make changes to the user profile here."}
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
                                defaultValue={user.name}
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
                                defaultValue={user.username}
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
                                placeholder="(Leave blank to keep current)"
                                className="col-span-3"
                                minLength={6}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                {t('users.table.role')}
                            </Label>
                            <Select name="roleId" defaultValue={user.roleId} required>
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
                            <Select name="organizationId" defaultValue={user.organizationId || "undefined"}>
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
                            {t('common.save') || "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
