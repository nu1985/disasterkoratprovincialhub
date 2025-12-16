'use client'

import { useState } from "react"
import { CreateUserDialog } from "./create-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/i18n-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MoreHorizontal, Pencil, Power, UserCog } from "lucide-react"
import { toggleUserStatus } from "./actions"
import { useToast } from "@/hooks/use-toast"

interface UsersClientProps {
    users: any[]
    roles: any[]
    orgs: any[]
}

export default function UsersClient({ users, roles, orgs }: UsersClientProps) {
    const { t, language } = useI18n()
    const { toast } = useToast()
    const [editingUser, setEditingUser] = useState<any>(null)

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        const result = await toggleUserStatus(userId, !currentStatus)
        if (result.success) {
            toast({
                title: t('common.success'),
                description: result.message,
            })
        } else {
            toast({
                title: t('common.error'),
                description: result.message,
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{t('users.title')}</h2>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <CreateUserDialog roles={roles || []} organizations={orgs || []} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('users.listTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('users.table.name')}</TableHead>
                                    <TableHead>{t('users.table.username')}</TableHead>
                                    <TableHead>{t('users.table.role')}</TableHead>
                                    <TableHead>{t('users.table.organization')}</TableHead>
                                    <TableHead>{t('common.status')}</TableHead>
                                    <TableHead>{t('common.createdAt')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions') || "Actions"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {t(`users.roles.${user.role.name}` as any) || user.role.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.organization?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={user.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                                                {user.isActive ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('common.actions') || "Actions"}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> {t('common.edit') || "Edit"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.isActive)}>
                                                        <Power className={`mr-2 h-4 w-4 ${user.isActive ? "text-red-500" : "text-green-500"}`} />
                                                        {user.isActive ? (t('users.actions.deactivate') || "Deactivate") : (t('users.actions.activate') || "Activate")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!users || users.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    roles={roles}
                    organizations={orgs}
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                />
            )}
        </div>
    )
}
