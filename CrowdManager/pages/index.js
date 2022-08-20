import styles from './index.module.css'
import Layout from '../components/layout'

export default function Home() {
  return (
    <div className={styles.container}>
      <Layout>
        <h1 className={styles.title}>
          Crowd Manager
        </h1>
      </Layout>
    </div>
  )
}

Home.auth = true
