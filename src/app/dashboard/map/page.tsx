import { getIncidentsForMap, getAvailableResources } from './actions'
import MapWrapper from './map-wrapper'
import { auth } from "@/lib/auth"

export default async function MapPage() {
    const { incidents } = await getIncidentsForMap()
    const { resources } = await getAvailableResources()
    const session = await auth()
    // @ts-ignore
    const userRole = session?.user?.role

    return <MapWrapper incidents={incidents || []} resources={resources || []} userRole={userRole} />
}
