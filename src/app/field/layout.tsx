import Link from "next/link"
import { Home, List, User } from "lucide-react"

export default function FieldLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md">
                <h1 className="font-bold text-lg">Field Unit App</h1>
            </header>
            <main className="p-4">
                {children}
            </main>
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-10">
                <Link href="/field" className="flex flex-col items-center text-slate-600 hover:text-red-600">
                    <List className="h-6 w-6" />
                    <span className="text-xs mt-1">My Tasks</span>
                </Link>
                <Link href="/field/profile" className="flex flex-col items-center text-slate-600 hover:text-red-600">
                    <User className="h-6 w-6" />
                    <span className="text-xs mt-1">Profile</span>
                </Link>
            </nav>
        </div>
    )
}
