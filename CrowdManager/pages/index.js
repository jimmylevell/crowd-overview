import styles from './index.module.css'

import { useSession } from "next-auth/react"

import Layout from '../components/layout'
import Send from '../components/send'

export default function Home() {
  const { data: session }= useSession()

  return (
    <div className={styles.container}>
      <Layout>
        <h1 className={styles.title}>
          SMS Sender
        </h1>


        { session?.user?.roles?.includes('Sender') ? (
          <Send />
        ): (
          <p>You are not authorized to send messages</p>
        ) }
      </Layout>
    </div>
  )
}

Home.auth = true
