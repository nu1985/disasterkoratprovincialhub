import { getUsers, getRoles, getOrganizations } from "./actions"
import UsersClient from "./users-client"

export default async function UsersPage() {
    const { users } = await getUsers()
    const { roles } = await getRoles()
    const { orgs } = await getOrganizations()

    return <UsersClient users={users || []} roles={roles || []} orgs={orgs || []} />
}
