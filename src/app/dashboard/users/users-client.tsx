'use client'

import { CreateUserDialog } from "./create-user-dialog"
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

interface UsersClientProps {
    users: any[]
    roles: any[]
    orgs: any[]
}

export default function UsersClient({ users, roles, orgs }: UsersClientProps) {
    const { t, language } = useI18n()

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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('users.table.name')}</TableHead>
                                <TableHead>{t('users.table.username')}</TableHead>
                                <TableHead>{t('users.table.role')}</TableHead>
                                <TableHead>{t('users.table.organization')}</TableHead>
                                <TableHead>{t('common.status')}</TableHead>
                                <TableHead>{t('common.createdAt')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role.name}</Badge>
                                    </TableCell>
                                    <TableCell>{user.organization?.name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge className={user.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</TableCell>
                                </TableRow>
                            ))}
                            {(!users || users.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No users found
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
