import { ICheckpoint } from "../model/Checkpoint"

export async function getCheckpoints() {
  return fetch('/api/checkpoint')
  .then(res => res.json())
  .then(data => {
      return data['checkpoints']
  })
}

export async function createCheckpoint(checkpoint: ICheckpoint) {
  return fetch('/api/checkpoint', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({checkpoint: checkpoint})
  })
  .then(res => res.json())
  .then(data => {
      return data['checkpoint']
  })
}

export async function deleteCheckpoint(id: String) {
  return fetch('/api/checkpoint/' + id, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
      return data['checkpoint']
  })
}

export async function updateCheckpoint(checkpoint: ICheckpoint) {
  return fetch('/api/checkpoint/' + checkpoint._id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({checkpoint: checkpoint})
  })
  .then(res => res.json())
  .then(data => {
      return data['checkpoint']
  })
}
