'use client'

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { getIncidentStatus } from "./actions"

export default function TrackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialId = searchParams.get("id") || ""

    const [searchId, setSearchId] = useState(initialId)
    const [loading, setLoading] = useState(false)
    const [incident, setIncident] = useState<any>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        if (initialId) {
            handleSearch(initialId)
        }
    }, [initialId])

    async function handleSearch(id: string) {
        if (!id) return
        setLoading(true)
        setError("")
        setIncident(null)

        const result = await getIncidentStatus(id)
        setLoading(false)

        if (result.success) {
            setIncident(result.incident)
        } else {
            setError(result.message || "Incident not found")
        }
    }

    const onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchId) {
            router.push(`/track?id=${searchId}`)
            // handleSearch(searchId) // useEffect will trigger
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Track Incident Status</h1>

                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <form onSubmit={onSearchSubmit} className="flex gap-2">
                            <Input
                                placeholder="Enter Incident ID (e.g. INC-2024-001)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="text-lg py-6"
                            />
                            <Button type="submit" size="lg" className="px-8" disabled={loading}>
                                {loading ? <Clock className="animate-spin" /> : <Search />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-8 border border-red-100">
                        <AlertCircle className="inline-block mr-2 h-5 w-5" />
                        {error}
                    </div>
                )}

                {incident && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{incident.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {incident.location?.subdistrict}, {incident.location?.district}, {incident.location?.province}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`text-lg px-4 py-1 ${incident.status === 'DONE' ? 'bg-green-500' :
                                            incident.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                'bg-yellow-500'
                                        }`}>
                                        {incident.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-2 text-slate-500">Description</h3>
                                        <p className="text-slate-900">{incident.description || "No description provided."}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 text-slate-500">Details</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between border-b pb-1">
                                                <span>Type:</span>
                                                <span className="font-medium">{incident.incidentType?.nameTh || incident.incidentType?.code}</span>
                                            </li>
                                            <li className="flex justify-between border-b pb-1">
                                                <span>Reported:</span>
                                                <span className="font-medium">{new Date(incident.reportedAt).toLocaleString()}</span>
                                            </li>
                                            <li className="flex justify-between border-b pb-1">
                                                <span>ID:</span>
                                                <span className="font-mono">{incident.id}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
                                    {incident.statusHistory.map((history: any, index: number) => (
                                        <div key={history.id} className="relative pl-8">
                                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-4 ring-white"></div>
                                            <div>
                                                <div className="text-sm text-slate-500 mb-1">
                                                    {new Date(history.changedAt).toLocaleString()}
                                                </div>
                                                <p className="font-medium text-slate-900">
                                                    Status changed to <span className="font-bold">{history.newStatus}</span>
                                                </p>
                                                {history.note && (
                                                    <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">
                                                        {history.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative pl-8">
                                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 ring-4 ring-white"></div>
                                        <div>
                                            <div className="text-sm text-slate-500 mb-1">
                                                {new Date(incident.reportedAt).toLocaleString()}
                                            </div>
                                            <p className="font-medium text-slate-900">Incident Reported</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
