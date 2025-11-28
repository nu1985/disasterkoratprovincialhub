'use client'

import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./map-client'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
})

export default function MapWrapper({ incidents }: { incidents: any[] }) {
    return <MapClient incidents={incidents} />
}
