

import { getSession } from "@/lib/getSession"
import DashboardClient from "@/components/DashboardClient"

export default async function Dashboard() {
    const session = await getSession()
    return (
        <>
            <DashboardClient ownerId={session?.user?.id!} email={session?.user?.email!} />
        </>
    )
}
