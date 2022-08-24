import { Schema, model, models, Types } from 'mongoose';
import db from '../services/db';

export interface IMeasurement {
  _id: String,
  object_class: Number,
  checkpoint_id: String,
  direction: String,
  measured_at: Date,
}

const MeasurementSchema = new Schema({
  _id: Types.ObjectId,
  object_class: Number,
  checkpoint_id: String,
  direction: String,
  measured_at: Date,
}, {
  collection: 'measurements',
  timestamps: true
})

const Measurement = models.Measurement || model<IMeasurement>('Measurement', MeasurementSchema);

export default Measurement;

export async function getMeasurements() {
	await db;
	return Measurement.find({}).sort({ createdAt: -1 });
  }
