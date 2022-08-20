import { Schema, Types, model, models } from 'mongoose';
import db from '../services/db';

const CheckpointSchema = new Schema({
  _id: Types.ObjectId,
  api_key: String,
  name: String,
  connected_checkpoints: [String],
}, {
  collection: 'checkpoints',
  timestamps: true
})

const Checkpoint = new models.Checkpoint || model('Checkpoint', CheckpointSchema);

export default Checkpoint;

export async function createCheckpoint(checkpoint: typeof Checkpoint) {
  await db;
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
