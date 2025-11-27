import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Search, ShieldAlert, Activity } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-red-600" />
            <span className="font-bold text-xl text-slate-900">Korat Disaster Hub</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium">Home</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium">Map</Link>
            <Link href="#" className="text-slate-600 hover:text-slate-900 font-medium">Contact</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Staff Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=2552&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Disaster Management Center
              <span className="block text-red-500 mt-2">Nakhon Ratchasima</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Centralized platform for reporting and tracking disaster incidents in Nakhon Ratchasima province. Fast, transparent, and integrated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/report">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg w-full sm:w-auto">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Incident
                </Button>
              </Link>
              <Link href="#track">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-6 text-lg w-full sm:w-auto backdrop-blur-sm">
                  <Search className="mr-2 h-5 w-5" />
                  Track Status
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Tracking Section */}
        <section id="track" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Track Incident Status</CardTitle>
                  <CardDescription>Enter your Incident ID or Phone Number to check progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input placeholder="e.g. INC-2024-001 or 0812345678" className="text-lg py-6" />
                    <Button size="lg" className="px-6">Track</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats / Info Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
                <p className="text-slate-600">24/7 monitoring of flood and disaster situations across the province.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rapid Response</h3>
                <p className="text-slate-600">Direct integration with local units for faster dispatch and assistance.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparent Tracking</h3>
                <p className="text-slate-600">Track your report status from submission to resolution.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Nakhon Ratchasima Provincial Administrative Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
