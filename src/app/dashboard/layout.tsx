import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
            <DashboardSidebar />

            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    Korat Hub
                </h1>
                <DashboardSidebar mobile />
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-6">
                {children}
            </main>
        </div>
    )
}


