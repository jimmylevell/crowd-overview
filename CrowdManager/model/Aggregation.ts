import { Schema, Types, model, models } from 'mongoose';
import db from '../services/db';

const AggregationSchema = new Schema({
	_id: Types.ObjectId;
	object_class: number;
	checkpoint_id: string;
	inbound_count: number;
	outbound_count: number;
	aggregated_at: Date;
}, {
	collection: 'aggregations',
	timestamps: true
  })

const Aggregation = models.Aggregation || model('Aggregation', AggregationSchema);
export default Aggregation;

export async function getAggregations() {
  await db;
  return Aggregation.find({}).sort({ createdAt: -1 });
}
