import { useState, useEffect } from 'react'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { CSVLink } from 'react-csv'

import COCO_CLASSES from '../utils/coco-classes'

export default function MeasurementsModal(props) {
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkpoint, setCheckpoint] = useState()

  const channel = useChannel(`measurement`)
  useEvent(channel, 'new_measurement_' + props?.checkpoint?._id, (data) => {
    const list = data.measurements.concat(measurements)
    setMeasurements(list)
  })

  useEffect(() => {
    if (props.checkpoint) {
      setMeasurements([])
      setLoading(true)
      setCheckpoint(props.checkpoint)
      fetch('/api/checkpoint/measurement/' + props.checkpoint._id)
        .then((res) => res.json())
        .then((data) => {
          setMeasurements(data.measurements)
          setLoading(false)
        })
    }
  }, [props.checkpoint])

  return (
    <div className="modal" tabIndex="-1" role="dialog" id="measurementsmodal">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-8 text-center">
            <h5 className="mb-0">
              Measurement of Checkpoint <b>{checkpoint?.name}</b>
            </h5>
            <CSVLink
              data={measurements}
              filename={'measurement_' + checkpoint?.name + '.csv'}
            >
              <i class="bi bi-filetype-csv"></i> Export Measurement
            </CSVLink>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Object Class</th>
                  <th>Confidence Score</th>
                  <th>Direction</th>
                  <th>Measured At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td>Loading...</td>
                  </tr>
                ) : (
                  measurements.map((measurement) => (
                    <tr key={measurement._id}>
                      <td>{COCO_CLASSES[measurement.object_class + 1]}</td>
                      <td>{measurement.confidence_score.toFixed(2)}</td>
                      <td>{measurement.direction}</td>
                      <td>
                        {
                          measurement.measured_at
                            ?.replace('T', ' ')
                            .split('.')[0]
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="modal-footer flex-nowrap p-0">
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
