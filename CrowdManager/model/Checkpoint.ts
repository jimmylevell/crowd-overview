import { Schema, Types, model, models } from 'mongoose';
import db from '../services/db';

export interface ICheckpoint {
  _id: String,
  api_key: String,
  name: String,
  connected_checkpoints: [String]
}

const CheckpointSchema = new Schema({
  _id: Types.ObjectId,
  api_key: String,
  name: String,
  connected_checkpoints: [String],
}, {
  collection: 'checkpoints',
  timestamps: true
})

const Checkpoint = models.Checkpoint || model<ICheckpoint>('Checkpoint', CheckpointSchema);

export default Checkpoint;

export async function createCheckpoint(checkpoint: typeof Checkpoint) {
  await db;
  checkpoint._id = Types.ObjectId();
  return Checkpoint.create(checkpoint);
}

export async function updateCheckpoint(checkpoint: typeof Checkpoint) {
  await db;
  return Checkpoint.updateOne({ _id: checkpoint._id }, checkpoint);
}

export async function getCheckpoints() {
  await db;
  return Checkpoint.find({}).sort({ createdAt: -1 });
}

export async function deleteCheckpoint(checkpointId: String) {
  await db;
  return Checkpoint.deleteOne({ _id: checkpointId });
}
