import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

export default function MeasurementsModal(props) {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkpoint, setCheckpoint] = useState();

  useEffect(() => {
    const pusher = new Pusher('0177fb2397ec95132111', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('measurement')

    channel.bind('new_measurement', data => {
      setMeasurements(data.measurements)
    })
  }, []);

  useEffect(() => {
    if (props.checkpoint) {
      setCheckpoint(props.checkpoint);
      fetch('/api/checkpoint/measurement/' + props.checkpoint._id)
        .then(res => res.json())
        .then(data => {
            setMeasurements(data.measurements);
            setLoading(false);
        })
      }
  }, [props.checkpoint]);

  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      id="measurementsmodal"
    >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content rounded-4 shadow">
        <div className="modal-body p-8 text-center">
          <h5 className="mb-0">Measurement of Checkpoint <b>{checkpoint?.name}</b></h5>
          <table className='table table-hover'>
          <thead>
              <tr>
              <th>Object Class</th>
              <th>Confidence Score</th>
              <th>Direction</th>
              <th>Measured At</th>
              </tr>
          </thead>
          <tbody>
              {loading ? <tr><td>Loading...</td></tr> : measurements.map(measurement => (
              <tr key={measurement._id}>
                  <td>{measurement.object_class}</td>
                  <td>{measurement.confidence_score}</td>
                  <td>{measurement.direction}</td>
                  <td>{measurement.measured_at}</td>
              </tr>
              )
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
