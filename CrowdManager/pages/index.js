import dynamic from 'next/dynamic'

import styles from './index.module.css'
import Layout from '../components/layout'


// disable server side rendering for this import
const Graph = dynamic(() => import('../components/graph'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className={styles.container}>
      <Layout>
        <h1 className={styles.title}>
          Crowd Manager
        </h1>

        <Graph
          data={"dinetwork {node[shape=circle]; 1 -> 1 -> 2; 2 -> 3; 2 -- 4; 2 -> 1 }"}
        />
      </Layout>
    </div>
  )
}

Home.auth = true
