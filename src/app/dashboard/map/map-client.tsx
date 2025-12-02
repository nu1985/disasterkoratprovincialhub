'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/components/i18n-provider'
import { CreateAssignmentDialog } from '../assignments/create-assignment-dialog'

// Fix Leaflet icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

interface MapClientProps {
    incidents: any[]
    resources: any[]
    userRole?: string
}

export default function MapClient({ incidents, resources, userRole }: MapClientProps) {
    const { t, language } = useI18n()
    const defaultCenter: [number, number] = [14.9799, 102.0978] // Korat City Center

    const canAssign = userRole === 'ADMIN' || userRole === 'STAFF'

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.menu.map')}</h2>

            <Card className="h-[600px] overflow-hidden">
                <MapContainer
                    center={defaultCenter}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {incidents.map((incident) => (
                        incident.location?.latitude && incident.location?.longitude && (
                            <Marker
                                key={incident.id}
                                position={[incident.location.latitude, incident.location.longitude]}
                                icon={icon}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[200px]">
                                        <h3 className="font-bold text-lg mb-1">{incident.title}</h3>
                                        <div className="flex gap-2 mb-2">
                                            <Badge variant="outline">{incident.incidentType.nameTh}</Badge>
                                            <Badge className={
                                                incident.status === 'NEW' ? 'bg-red-500' :
                                                    incident.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                        'bg-gray-500'
                                            }>
                                                {t(`incidents.statuses.${incident.status}` as any) || incident.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {incident.location.district}, {incident.location.province}
                                        </p>
                                        <p className="text-xs text-gray-400 mb-3">
                                            {new Date(incident.createdAt).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                                        </p>

                                        {canAssign && (
                                            <div className="mt-2 pt-2 border-t">
                                                <CreateAssignmentDialog
                                                    incidents={incidents}
                                                    resources={resources}
                                                    defaultIncidentId={incident.id}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            </Card>
        </div>
    )
}
