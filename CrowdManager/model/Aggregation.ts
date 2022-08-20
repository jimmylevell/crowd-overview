import { Schema, Types, model, models } from 'mongoose';
import db from '../services/db';

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
const Aggregation = new models.Aggregation || model('Aggregation', AggregationSchema);
export default Aggregation;

export async function getAggregations() {
  await db;
  return Aggregation.find({}).sort({ createdAt: -1 });
}
