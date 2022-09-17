import { useState, useEffect } from 'react'

export default function SettingsEditor(props) {
  const [id, setId] = useState(null)
  const [numbeOfStartPoints, setNumbeOfStartPoints] = useState(0)
  const [numberOfEndPoints, setNumberOfEndPoints] = useState(0)

  useEffect(() => {
    if (props.settings) {
      setId(props.settings._id)
      setNumbeOfStartPoints(props.settings.number_of_start_points)
      setNumberOfEndPoints(props.settings.number_of_end_points)
    }
  }, [props.settings])

  const handleChange = (e) => {
    const { name, value } = e.target

    switch (name) {
      case 'numbeOfStartPoints':
        setNumbeOfStartPoints(value)
        break
      case 'numberOfEndPoints':
        setNumberOfEndPoints(value)
        break
      default:
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    props.onSubmit({
      _id: id,
      number_of_start_points: numbeOfStartPoints,
      number_of_end_points: numberOfEndPoints,
    })
  }

  return (
    <div className="modal" tabIndex="-1" role="dialog" id="settingseditor">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-8 text-center">
            <h5 className="mb-0">Settings Editor</h5>
            <form>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Number of Starting Points
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    onChange={handleChange}
                    value={numbeOfStartPoints}
                    className="form-control"
                    name="numbeOfStartPoints"
                    id="numbeOfStartPoints"
                    aria-describedby="NameHelp"
                    placeholder="Enter Name the Number of Start Points"
                    required
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  Number of Ending Points
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    onChange={handleChange}
                    value={numberOfEndPoints}
                    className="form-control"
                    name="numberOfEndPoints"
                    id="numberOfEndPoints"
                    aria-describedby="NameHelp"
                    placeholder="Enter the Number of End Points"
                    required
                  />
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
