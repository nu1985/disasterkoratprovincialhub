import { getAssignmentDetails } from "./actions"
import TaskDetailClient from "./task-detail-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function FieldTaskDetailPage({ params }: { params: { id: string } }) {
    const { success, assignment } = await getAssignmentDetails(params.id)

    if (!success || !assignment) {
        return <div className="p-8 text-center text-red-500">Task not found</div>
    }

    return (
        <div className="space-y-4">
            <Link href="/field">
                <Button variant="ghost" size="sm" className="pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>
            </Link>
            <TaskDetailClient assignment={assignment} />
        </div>
    )
}
