import { useState, useEffect } from 'react'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { CSVLink } from 'react-csv'

export default function AggregationsModal(props) {
  const [aggregations, setAggregations] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkpoint, setCheckpoint] = useState()

  const channel = useChannel(`aggregations`)
  useEvent(channel, 'new_aggregations_' + props?.checkpoint?._id, (data) => {
    const list = data.aggregations.concat(aggregations)
    setAggregations(list)
  })

  useEffect(() => {
    if (props.checkpoint) {
      setAggregations([])
      setLoading(true)
      setCheckpoint(props.checkpoint)
      fetch('/api/checkpoint/aggregation/' + props.checkpoint._id)
        .then((res) => res.json())
        .then((data) => {
          setAggregations(data.aggregations)
          setLoading(false)
        })
    }
  }, [props.checkpoint])

  return (
    <div className="modal" tabIndex="-1" role="dialog" id="aggregationsmodal">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-8 text-center">
            <h5 className="mb-0">
              Aggregations of Checkpoint <b>{checkpoint?.name}</b>
            </h5>
            <CSVLink
              data={aggregations}
              filename={'measurement_' + checkpoint?.name + '.csv'}
            >
              <i class="bi bi-filetype-csv"></i> Export Aggregations
            </CSVLink>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Object Class</th>
                  <th>Direction</th>
                  <th>Aggregated At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td>Loading...</td>
                  </tr>
                ) : (
                  aggregations.map((aggregation) => (
                    <tr key={aggregation._id}>
                      <td>{aggregation.object_class}</td>
                      <td>{aggregation.direction}</td>
                      <td>
                        {
                          aggregation.aggregated_at
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
