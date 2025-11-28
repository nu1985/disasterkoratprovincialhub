'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    AlertTriangle,
    Users,
    Settings,
    LogOut,
    Map as MapIcon,
    ListTodo,
    Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

interface DashboardSidebarProps {
    mobile?: boolean
}

export function DashboardSidebar({ mobile }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { t } = useI18n()
    const [open, setOpen] = useState(false)

    const isActive = (path: string) => pathname === path

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-red-500" />
                    Korat Hub
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.overview')}
                    </Button>
                </Link>
                <Link href="/dashboard/incidents" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/incidents') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.incidents')}
                    </Button>
                </Link>
                <Link href="/dashboard/assignments" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/assignments') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <ListTodo className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.assignments')}
                    </Button>
                </Link>
                <Link href="/dashboard/map" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/map') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <MapIcon className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.map')}
                    </Button>
                </Link>
                <Link href="/dashboard/users" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/users') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.users')}
                    </Button>
                </Link>
                <Link href="/dashboard/resources" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/resources') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.resources')}
                    </Button>
                </Link>
                <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive('/dashboard/settings') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.settings')}
                    </Button>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="font-bold text-xs">AD</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-slate-400">admin@korat.go.th</p>
                    </div>
                </div>
                <Link href="/api/auth/signout">
                    <Button variant="destructive" className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('dashboard.menu.logout')}
                    </Button>
                </Link>
            </div>
        </div>
    )

    if (mobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r-slate-800 w-72 bg-slate-900 text-white border-none">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full">
            <SidebarContent />
        </aside>
    )
}
