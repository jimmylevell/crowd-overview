import { Node } from 'vis-network'
import { getSettings } from './settings_service'
import { ICheckpoint } from '../model/Checkpoint'
import {
  getAggregations,
  getAggregationsByTimeSlot,
} from './aggregation_service'
import COCO_CLASSES from '../utils/coco-classes'

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
      id: name.toLocaleLowerCase() + '_' + i,
      shape: 'triangle',
      label: name + ' ' + i,
    })
  )
}

export async function getTimeSteps() {
  const aggregations = (await getAggregations()).reverse()

  // @ts-ignore
  return [...new Set(aggregations.map((item) => item.createdAt))] // aggregated_at
}

export async function getResultingGraph(currentTimeStep: Date) {
  const checkpoints = await getCheckpoints()
  const settings = await getSettings()
  let aggregations

  if (currentTimeStep)
    aggregations = await getAggregationsByTimeSlot(currentTimeStep)

  // add checkpoint to graph
  const nodes: Node[] = checkpoints.map((checkpoint) => {
    return {
      id: checkpoint._id,
      shape: 'box',
      label: 'Checkpoint ' + checkpoint.name,
    }
  })

  for (let i = 1; i <= settings.number_of_static_points; i++) {
    nodes.push(createNewNode('Static', i))
  }

  // add edges based on inbound and outbound connections from checkpoints
  const edges = []
  checkpoints.forEach((checkpoint) => {
    checkpoint.inbound_connections.forEach((connection) => {
      edges.push({
        from: connection,
        to: checkpoint._id,
        value: 0,
        label: '',
      })
    })

    // create bidirectional edges
    checkpoint.outbound_connections.forEach((connection) => {
      edges.push({
        from: checkpoint._id,
        to: connection,
        value: 0,
        label: '',
      })
    })
  })

  // add bidirectional edges between static points
  edges.forEach((edge) => {
    if (edge.from.includes('static')) {
      edges.push({
        from: edge.to,
        to: edge.from,
        value: 0,
        label: '',
      })
    }
  })

  if (currentTimeStep) {
    // add edges based on aggregations
    aggregations.forEach((aggregation) => {
      edges.forEach((edge) => {
        // outbounding connects are associated with the static nodes
        // inbound connections are associated with the other checkpoints

        if (
          aggregation.direction === 'in' &&
          !edge.from.includes('static') &&
          !edge.to.includes('static')
        ) {
          const number_of_outgoing_connections =
            edges.filter((edge) => edge.from === aggregation.checkpoint_id)
              .length - 1
          const count_per_connection = Math.ceil(
            aggregation.count / number_of_outgoing_connections
          )

          if (edge.from === aggregation.checkpoint_id) {
            edge.value += edge.value + count_per_connection
            edge.label =
              edge.label +
              ', ' +
              'out: ' +
              COCO_CLASSES[aggregation.object_class + 1] +
              ' ' +
              count_per_connection
          }
        }

        if (
          aggregation.direction === 'out' &&
          (edge.from.includes('static') || edge.to.includes('static'))
        ) {
          // outbounding connections
          if (aggregation.checkpoint_id === edge.from) {
            edge.label =
              edge.label +
              ', ' +
              'out: ' +
              COCO_CLASSES[aggregation.object_class + 1] +
              ' ' +
              aggregation.count
            edge.value = edge.value + aggregation.count
          }
        }
      })
    })
  }

  const network = { nodes: nodes, edges: edges }

  return network
}
