import mongoose, { Document, model, models, Model, Schema } from 'mongoose'
import db from '../utils/db'

export interface IAggregation {
  _id: string
  object_class: number
  checkpoint_id: string
  direction: string
  aggregated_at: Date
}

const AggregationSchema: Schema = new Schema(
  {
    object_class: Number,
    checkpoint_id: String,
    direction: String,
    aggregated_at: Date,
  },
  {
    collection: 'aggregations',
    timestamps: true,
  }
)

const Aggregation: Model<IAggregation> =
  models.Aggregation || model<IAggregation>('Aggregation', AggregationSchema)

export async function getAggregations() {
  await db

  // @ts-ignore
  return Aggregation.find({}).sort({ createdAt: -1 })
}

export async function getAggregationsByCheckpointId(checkpoint_id: string) {
  await db

  return Aggregation.find({ checkpoint_id: checkpoint_id }).sort({
    createdAt: -1,
  })
}

export async function getAggregationsByTimeSlot(timeSlot: Date) {
  await db

  return Aggregation.find({ createdAt: timeSlot }).sort({ createdAt: -1 })
}
