export default function Checkpoint({ onDelete, onEdit, onLog, checkpoint }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title">{checkpoint.name}</h5>

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
          onClick={onLog}
        >
          <i className="bi bi-file-earmark-text"></i> View Log
        </button>

        <button
          type="button"
          className="btn btn-danger m-1"
          onClick={onDelete}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  )
}
