import { ICheckpoint } from '../model/Checkpoint'
import { Node } from 'vis-network'
import { getSettings } from './settings_service'

export async function getCheckpoints() {
  return fetch('/api/checkpoint')
    .then((res) => res.json())
    .then((data) => {
      return data['checkpoints']
    })
}

export async function createCheckpoint(checkpoint: ICheckpoint) {
  return fetch('/api/checkpoint', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkpoint: checkpoint }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data['checkpoint']
    })
}

export async function deleteCheckpoint(id: String) {
  return fetch('/api/checkpoint/' + id, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => {
      return data['checkpoint']
    })
}

export async function updateCheckpoint(checkpoint: ICheckpoint) {
  return fetch('/api/checkpoint/' + checkpoint._id, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checkpoint: checkpoint }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data['checkpoint']
    })
}

function createNewNode(name, i) {
  return JSON.parse(
    JSON.stringify({
      id: name + '_' + i,
      shape: 'triangle',
      size: 20,
      label: name + ' ' + i,
    })
  )
}

export async function getResultingGraph() {
  const checkpoints = await getCheckpoints()
  const settings = await getSettings()

  // add checkpoint to graph
  const nodes: Node[] = checkpoints.map((checkpoint) => {
    return {
      id: checkpoint._id,
      shape: 'box',
      size: 20,
      label: 'Checkpoint ' + checkpoint.name,
    }
  })

  for (let i = 1; i <= settings.number_of_start_points; i++) {
    nodes.push(createNewNode('start', i))
  }

  for (let i = 1; i <= settings.number_of_end_points; i++) {
    nodes.push(createNewNode('end', i))
  }

  // add edges based on inbound and outbound connections from checkpoints
  const edges = []
  checkpoints.forEach((checkpoint) => {
    checkpoint.inbound_connections.forEach((connection) => {
      edges.push({ from: connection, to: checkpoint._id })
    })

    // create bidirectional edges
    checkpoint.outbound_connections.forEach((connection) => {
      edges.push({ from: checkpoint._id, to: connection })
    })
  })

  const network = { nodes: nodes, edges: edges }

  return network
}
