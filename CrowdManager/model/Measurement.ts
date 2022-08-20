import { Schema, model, models, Types } from 'mongoose';
import db from '../services/db';

const MeasurementSchema = new Schema({
  _id: Types.ObjectId,
  object_class: number,
  checkpoint_id: String,
  direction: string,
  measured_at: Date,
}, {
  collection: 'measurements',
  timestamps: true
})

const Measurement = models.Measurement || model('Measurement', MeasurementSchema);

export default Measurement;

export async function getMeasurements() {
	await db;
	return Measurement.find({}).sort({ createdAt: -1 });
  }
