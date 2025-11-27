import Link from "next/link"
import {
    LayoutDashboard,
    AlertTriangle,
    Users,
    Settings,
    LogOut,
    Map as MapIcon,
    ListTodo
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-red-500" />
                        Korat Hub
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Overview
                        </Button>
                    </Link>
                    <Link href="/dashboard/incidents">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Incidents
                        </Button>
                    </Link>
                    <Link href="/dashboard/assignments">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <ListTodo className="mr-2 h-4 w-4" />
                            Assignments
                        </Button>
                    </Link>
                    <Link href="/dashboard/map">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <MapIcon className="mr-2 h-4 w-4" />
                            Map View
                        </Button>
                    </Link>
                    <Link href="/dashboard/users">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Users className="mr-2 h-4 w-4" />
                            Users & Units
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
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
                            Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
