import { useState, useEffect } from 'react'
import { randomBytes } from 'crypto'

export default function CheckpointEditor(props) {
  const _id = props.checkpoint?._id

  const [name, setName] = useState('')
  const [passwordType, setPasswordType] = useState('password')
  const [api_key, setApi_key] = useState('')
  const [startPoints, setStartPoints] = useState([])
  const [selectedStartPoints, setSelectedStartPoints] = useState([])
  const [endPoints, setEndPoints] = useState([])
  const [selectedEndPoints, setSelectedEndPoints] = useState([])

  useEffect(() => {
    initCheckpoint()
    addStartingEndingPoints()
  }, [props.checkpoints, props.checkpoint, props.settings])

  const initCheckpoint = () => {
    if (props.checkpoint) {
      setName(props.checkpoint.name)
      setApi_key(props.checkpoint.api_key)
      setSelectedStartPoints(props.checkpoint.inbound_connections)
      setSelectedEndPoints(props.checkpoint.outbound_connections)
    } else {
      setName('')
      setApi_key('')
      setSelectedStartPoints([])
      setSelectedEndPoints([])
    }
  }

  const addStartingEndingPoints = () => {
    if (props.settings) {
      // add static points according to defined number of static points
      let staticPoints = []
      for (let i = 1; i <= props.settings.number_of_static_points; i++) {
        staticPoints.push({ key: 'static_' + i, value: 'Static Point ' + i })
      }

      staticPoints = addCheckpoints(staticPoints, props.checkpoints)
      setStartPoints(staticPoints)
      setEndPoints(staticPoints)
    }
  }

  const addCheckpoints = (points, checkpoints) => {
    let pnts = points
    checkpoints.forEach((checkpoint) => {
      if (checkpoint._id !== _id) {
        pnts.push({
          key: checkpoint._id,
          value: 'Checkpoint ' + checkpoint.name,
        })
      }
    })

    return pnts
  }

  const getMultipleSelectOptions = (e) => {
    return [...e.target.selectedOptions].map((o) => o.value)
  }
  const handleChange = (e) => {
    const { name, value } = e.target

    switch (name) {
      case 'checkpointName':
        setName(value)
        break
      case 'checkpointAPIkey':
        setApi_key(value)
        break
      case 'startPoints':
        setSelectedStartPoints(getMultipleSelectOptions(e))
        break
      case 'endPoints':
        setSelectedEndPoints(getMultipleSelectOptions(e))
        break
      default:
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    props.onSubmit({
      _id: _id,
      name: name,
      api_key: api_key,
      inbound_connections: selectedStartPoints,
      outbound_connections: selectedEndPoints,
    })

    setName('')
    setApi_key('')
    setSelectedStartPoints([])
    setSelectedEndPoints([])
  }

  const generateKey = (e, size = 32, format = 'base64') => {
    e.preventDefault()

    const buffer = randomBytes(size)
    setApi_key(buffer.toString(format))
  }

  const togglePassword = (e) => {
    e.preventDefault()
    if (passwordType === 'password') {
      setPasswordType('text')
    } else {
      setPasswordType('password')
    }
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog" id="checkpointeditor">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-8 text-center">
            <h5 className="mb-0">Checkpoint Editor</h5>
            <form>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    onChange={handleChange}
                    value={name}
                    className="form-control"
                    name="checkpointName"
                    id="checkpointName"
                    aria-describedby="NameHelp"
                    placeholder="Enter Name of Checkpoint"
                    required
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">API Key</label>
                <div className="col-sm-10">
                  <div className="input-group mb-2">
                    <input
                      type={passwordType}
                      onChange={handleChange}
                      value={api_key}
                      className="form-control"
                      name="checkpointAPIkey"
                      id="checkpointAPIkey"
                      placeholder="API Key"
                      required
                    />
                    <div className="input-group-prepend">
                      <button
                        className="btn btn-outline-primary"
                        onClick={togglePassword}
                      >
                        {passwordType === 'password' ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </button>
                    </div>

                    <div className="input-group-prepend">
                      <button
                        className="btn btn-outline-primary"
                        onClick={generateKey}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Inbound Connection
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-2">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="startPoints"
                      multiple
                      value={selectedStartPoints}
                      onChange={handleChange}
                    >
                      {startPoints.map((point) => (
                        <option key={point.key} value={point.key}>
                          {point.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Outbound Connection
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-2">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      multiple
                      name="endPoints"
                      onChange={handleChange}
                      value={selectedEndPoints}
                    >
                      {endPoints.map((point) => (
                        <option key={point.key} value={point.key}>
                          {point.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer flex-nowrap p-0">
            <button
              type="button"
              className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border-right"
              onClick={handleSubmit}
              data-bs-dismiss="modal"
            >
              <strong>
                <i className="bi bi-box-arrow-down"></i> Save
              </strong>
            </button>
            <button
              type="button"
              className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
