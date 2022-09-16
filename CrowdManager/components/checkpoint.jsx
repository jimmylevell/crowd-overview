export default function Checkpoint({
  onDelete,
  onEdit,
  onMeasurement,
  checkpoint,
}) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6 class="card-subtitle mb-2 text-muted">{checkpoint._id}</h6>
        <h6 class="card-subtitle mb-2 text-muted">
          <i>
            Last updated:{' '}
            {checkpoint.updatedAt.toString()?.replace('T', ' ').split('.')[0]}
          </i>
        </h6>
        <h5 className="card-title">{checkpoint.name}</h5>
        <h6 className="card-title float-right"></h6>

        <button
          type="button"
          className="btn btn-primary m-1"
          onClick={onEdit}
          data-bs-toggle="modal"
          data-bs-target="#checkpointeditor"
        >
          <i className="bi bi-pencil"></i> Edit
        </button>

        <button
          type="button"
          className="btn btn-primary m-1"
          onClick={onMeasurement}
          data-bs-toggle="modal"
          data-bs-target="#measurementsmodal"
        >
          <i className="bi bi-file-earmark-text"></i> View Log
        </button>

        <button
          type="button"
          className="btn btn-primary m-1"
          onClick={onMeasurement}
          data-bs-toggle="modal"
          data-bs-target="#aggregationsmodal"
        >
          <i class="bi bi-bar-chart-line"></i> View Aggregations
        </button>

        <button type="button" className="btn btn-danger m-1" onClick={onDelete}>
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  )
}
