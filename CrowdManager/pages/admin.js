import { useSession } from "next-auth/react"

import Layout from "../components/layout";
import Log from '../components/log';

export default function Admin() {
    const { data: session }= useSession()

    return (
        <Layout>
            <h1>Admin</h1>

            { session?.user?.roles?.includes('Admin') ? (
                <Log />
            ): (
                <p>You are not authorized to view logs</p>
            ) }
        </Layout>
    )
}
