import { getIncidentsForMap } from './actions'
import MapWrapper from './map-wrapper'

export default async function MapPage() {
    const { incidents } = await getIncidentsForMap()

    return <MapWrapper incidents={incidents || []} />
}
