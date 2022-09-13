import { Schema, Types, model, models } from 'mongoose'
import db from '../utils/db'

export interface IAggregation {
  _id: String
  object_class: Number
  checkpoint_id: String
  inbound_count: Number
  outbound_count: Number
  aggregated_at: Date
}

const AggregationSchema = new Schema(
  {
    _id: Types.ObjectId,
    object_class: Number,
    checkpoint_id: String,
    inbound_count: Number,
    outbound_count: Number,
    aggregated_at: Date,
  },
  {
    collection: 'aggregations',
    timestamps: true,
  }
)

const Aggregation =
  models.Aggregation || model<IAggregation>('Aggregation', AggregationSchema)
export default Aggregation

export async function getAggregations() {
  await db

  // @ts-ignore
  return Aggregation.find({}).sort({ createdAt: -1 })
}
