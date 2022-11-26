import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import styles from './index.module.css'
import Layout from '../components/layout'
import ToastNotification from '../components/toastnotification'

import { getResultingGraph } from '../services/checkpoint_service'

// disable server side rendering for this import
const Graph = dynamic(() => import('../components/graph'), {
  ssr: false,
})

export default function Home() {
  const [currentTimeStep, setCurrentTimeStep] = useState(0)
  const [stepSize, setStepSize] = useState(0.5)
  const [graph, setGraph] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

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

  const handleStepSizeChange = (event) => {
    setCurrentTimeStep(event.target.value)
  }

  return (
    <div className={styles.container}>
      <ToastNotification body={message} error={error} />

      <Layout>
        <h1 className={styles.title}>Crowd Manager</h1>

        <Graph data={graph} />
        <div>
          <div className="alert alert-primary" role="alert">
            <label for="currentTimeStep" className="form-label">
              Current Time Slot Selected: {currentTimeStep}
            </label>
          </div>

          <input
            type="range"
            className="form-range"
            min="0"
            max="5"
            step={stepSize}
            value={currentTimeStep}
            id="currentTimeStep"
            onChange={handleStepSizeChange}
          />
        </div>
      </Layout>
    </div>
  )
}

Home.auth = true
