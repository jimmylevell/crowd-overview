import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import styles from './index.module.css'
import Layout from '../components/layout'
import ToastNotification from '../components/toastnotification'

import { getResultingGraph, getTimeSteps } from '../services/checkpoint_service'

// disable server side rendering for this import
const Graph = dynamic(() => import('../components/graph'), {
  ssr: false,
})

export default function Home() {
  const [timeSteps, setTimeSteps] = useState([])
  const [currentTimeStep, setCurrentTimeStep] = useState(0)
  const [graph, setGraph] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const stepSize = 1

  useEffect(() => {
    loadTimeSteps()
  }, [])

  useEffect(() => {
    loadGraph(currentTimeStep)
  }, [currentTimeStep])

  const loadTimeSteps = async () => {
    getTimeSteps()
      .then((timeSteps) => {
        if (timeSteps.length > 0) {
          setCurrentTimeStep(timeSteps[0])
          setTimeSteps(timeSteps)
        }
      })
      .catch((error) => {
        setError(error)
        setMessage('Could not load time steps')
      })
  }

  const loadGraph = async (currentTimeStep) => {
    getResultingGraph(currentTimeStep)
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
    setCurrentTimeStep(timeSteps[event.target.value])
  }

  return (
    <div className={styles.container}>
      <ToastNotification body={message} error={error} />

      <Layout>
        <h1 className={styles.title}>Crowd Manager</h1>

        <Graph data={graph} />
        <div>
          <div className="alert alert-primary" role="alert">
            <label htmlFor="currentTimeStep" className="form-label">
              Current Time Slot Selected: {currentTimeStep}
            </label>
          </div>

          <input
            type="range"
            className="form-range"
            min="0"
            max={timeSteps.length - 1}
            step={stepSize}
            id="currentTimeStep"
            onChange={handleStepSizeChange}
          />
        </div>
      </Layout>
    </div>
  )
}

Home.auth = true
