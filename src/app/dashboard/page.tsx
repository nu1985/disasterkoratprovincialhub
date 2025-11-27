import { getDashboardStats } from "./actions"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
    const { success, stats, chartData } = await getDashboardStats()

    if (!success || !stats || !chartData) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load dashboard data.
            </div>
        )
    }

    return <DashboardClient stats={stats} chartData={chartData} />
}
