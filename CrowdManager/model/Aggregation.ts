import { Schema, Types, model, models } from 'mongoose';
import db from '../services/db';

export interface IAggregation {
	_id: String,
	object_class: Number,
	checkpoint_id: String,
	inbound_count: Number,
	outbound_count: Number,
	aggregated_at: Date
}

const AggregationSchema = new Schema({
	_id: Types.ObjectId,
	object_class: Number,
	checkpoint_id: String,
	inbound_count: Number,
	outbound_count: Number,
	aggregated_at: Date
}, {
	collection: 'aggregations',
	timestamps: true
})

// https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way
const Aggregation = models.Aggregation || model<IAggregation>('Aggregation', AggregationSchema);
export default Aggregation;

export async function getAggregations() {
  await db;
  return Aggregation.find({}).sort({ createdAt: -1 });
}
