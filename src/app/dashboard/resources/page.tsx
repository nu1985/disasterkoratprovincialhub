import { getResources } from "./actions"
import { getOrganizations } from "../users/actions" // Reuse existing action
import ResourcesClient from "./resources-client"

export default async function ResourcesPage() {
    const { resources } = await getResources()
    const { orgs } = await getOrganizations()

    return <ResourcesClient resources={resources || []} organizations={orgs || []} />
}
