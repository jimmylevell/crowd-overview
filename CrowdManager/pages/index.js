import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import styles from './index.module.css'
import Layout from '../components/layout'

import { getResultingGraph } from '../services/checkpoint_service'

// disable server side rendering for this import
const Graph = dynamic(() => import('../components/graph'), {
  ssr: false,
})

export default function Home() {
  const [graph, setGraph] = useState(null)

  useEffect(() => {
    loadGraph()
  }, [])

  const loadGraph = async () => {
    getResultingGraph()
      .then((data) => {
        if (data) {
          setGraph(data)
        }
      })
      .catch((err) => {
        setError(err)
        setMessage('Error loading graph')
      })
  }

  return (
    <div className={styles.container}>
      <Layout>
        <h1 className={styles.title}>Crowd Manager</h1>

        <Graph data={graph} />
      </Layout>
    </div>
  )
}

Home.auth = true
