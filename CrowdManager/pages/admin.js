import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import Layout from '../components/layout'
import Checkpoint from '../components/checkpoint'
import CheckpointEditor from '../components/checkpoint-editor'
import SettingsEditor from '../components/settings-editor'
import ToastNotification from '../components/toastnotification'
import MeasurementsModal from '../components/measurements-modal'
import AggregationsModal from '../components/aggregations-modal'
const Graph = dynamic(() => import('../components/graph'), {
  ssr: false,
})

import {
  getCheckpoints,
  updateCheckpoint,
  createCheckpoint,
  deleteCheckpoint,
  getResultingGraph,
} from '../services/checkpoint_service'
import {
  createSettings,
  updateSettings,
  getSettings,
} from '../services/settings_service'

export default function Admin() {
  const [settings, setSettings] = useState(null)

  const [checkpointSelected, setcheckpointSelected] = useState(null)
  const [checkpoints, setCheckpoints] = useState([])

  const [graph, setGraph] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadSettings()
    loadCheckpoints()
  }, [])

  useEffect(() => {
    loadGraph()
  }, [checkpoints, settings])

  const handleCheckpointChange = (checkpoint) => {
    if (checkpoint._id) {
      updateCheckpoint(checkpoint)
        .then(() => {
          setMessage('Checkpoint ' + checkpoint.name + ' updated successfully')
          loadCheckpoints()
        })
        .catch((err) => {
          setError(err)
          setMessage('Error updating checkpoint ' + checkpoint.name)
        })
    } else {
      createCheckpoint(checkpoint)
        .then(() => {
          setMessage('Checkpoint ' + checkpoint.name + ' created successfully')
          loadCheckpoints()
        })
        .catch((err) => {
          setError(err)
          setMessage('Error creating checkpoint ' + checkpoint.name)
        })
    }
  }

  const handleSettingsChange = (settings) => {
    if (settings._id) {
      updateSettings(settings)
        .then(() => {
          setSettings(settings)
          setMessage('Settings updated successfully')
        })
        .catch((err) => {
          setError(err)
          setMessage('Error updating settings')
        })
    } else {
      createSettings(settings)
        .then(() => {
          setSettings(settings)
          setMessage('Settings created successfully')
        })
        .catch((err) => {
          setError(err)
          setMessage('Error creating settings')
        })
    }
  }

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

  const loadSettings = async () => {
    getSettings()
      .then((data) => {
        if (data) {
          setSettings(data)
        }
      })
      .catch((err) => {
        setError(err)
        setMessage('Error loading settings')
      })
  }

  const loadCheckpoints = async () => {
    setLoading(true)
    getCheckpoints()
      .then((data) => {
        if (data) {
          setCheckpoints(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }

  const onDelete = (id) => {
    deleteCheckpoint(id)
      .then(() => {
        setMessage('Checkpoint ' + id + ' deleted successfully')
        loadCheckpoints()
      })
      .catch((err) => {
        setError(err)
        setMessage('Error deleting checkpoint ' + id)
      })
  }

  const onEdit = (checkpoint) => {
    setcheckpointSelected(checkpoint)
  }

  const onMeasurement = (checkpoint) => {
    setcheckpointSelected(checkpoint)
  }

  return (
    <Layout>
      <h1>Admin</h1>

      <ToastNotification body={message} error={error} />

      <div className="row">
        <div className="col-sm-4">
          <button
            type="button"
            className="btn btn-primary ml-3"
            data-bs-toggle="modal"
            data-bs-target="#checkpointeditor"
            onClick={() => setcheckpointSelected(null)}
          >
            <i className="bi bi-plus-lg"></i> Add Checkpoint
          </button>

          <button
            type="button"
            className="btn btn-primary m-3"
            data-bs-toggle="modal"
            data-bs-target="#settingseditor"
          >
            <i className="bi bi-pencil"></i> Edit Global Settings
          </button>

          <CheckpointEditor
            checkpoint={checkpointSelected}
            checkpoints={checkpoints}
            onSubmit={handleCheckpointChange}
            settings={settings}
          />

          <SettingsEditor settings={settings} onSubmit={handleSettingsChange} />

          <MeasurementsModal checkpoint={checkpointSelected} />
          <AggregationsModal checkpoint={checkpointSelected} />

          {loading && <div>Loading...</div>}

          {checkpoints.length > 0 ? (
            checkpoints.map((checkpoint) => (
              <Checkpoint
                key={checkpoint._id}
                checkpoint={checkpoint}
                onDelete={() => onDelete(checkpoint._id)}
                onEdit={() => onEdit(checkpoint)}
                onMeasurement={() => onMeasurement(checkpoint)}
              />
            ))
          ) : (
            <p>No checkpoints found so far, feel free to create one</p>
          )}
        </div>

        <div className="col-sm-8">{graph && <Graph data={graph} />}</div>
      </div>
    </Layout>
  )
}
