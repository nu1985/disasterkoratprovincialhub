
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SignOutPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-slate-900">ออกจากระบบ</CardTitle>
                    <CardDescription className="text-slate-600">
                        คุณต้องการออกจากระบบใช่หรือไม่?
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/login" })
                        }}
                    >
                        <Button variant="destructive" type="submit" className="w-full min-w-[120px]">
                            ยืนยันการออก
                        </Button>
                    </form>
                    <form action="/dashboard">
                        <Button variant="outline" type="submit" className="w-full min-w-[120px]">
                            ยกเลิก
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
