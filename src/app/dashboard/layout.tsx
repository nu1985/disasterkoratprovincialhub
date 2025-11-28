import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}


