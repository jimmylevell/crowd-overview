import mongoose, { Document, model, models, Model, Schema } from 'mongoose'
import db from '../utils/db'

export interface ICheckpoint extends Document {
  api_key: string
  name: string
  inbound_connections: Array<string>
  outbound_connections: Array<string>
}

const CheckpointSchema: Schema = new Schema(
  {
    api_key: String,
    name: String,
    inbound_connections: [String],
    outbound_connections: [String],
  },
  {
    collection: 'checkpoints',
    timestamps: true,
  }
)

export const Checkpoint: Model<ICheckpoint> =
  models.Checkpoint || model<ICheckpoint>('Checkpoint', CheckpointSchema)

export async function createCheckpoint(checkpoint: ICheckpoint) {
  await db
  return Checkpoint.create(checkpoint)
}

export async function updateCheckpoint(checkpoint: ICheckpoint) {
  await db
  return Checkpoint.updateOne({ _id: checkpoint._id }, checkpoint)
}

export async function getCheckpoints() {
  await db
  return Checkpoint.find({}).sort({ createdAt: -1 })
}

export async function deleteCheckpoint(checkpointId: String) {
  await db
  return Checkpoint.deleteOne({ _id: checkpointId })
}

export async function getCheckpointByAPIKey(api_key: String) {
  await db
  return Checkpoint.findOne({ api_key: api_key })
}
