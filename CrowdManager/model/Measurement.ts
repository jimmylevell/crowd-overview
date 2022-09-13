import mongoose, { Document, model, models, Model, Schema } from 'mongoose'
import db from '../utils/db'

export interface IMeasurement extends Document {
  _id: String
  object_class: Number
  checkpoint_id: String
  confidence_score: Number
  direction: String
  measured_at: Date
}

const MeasurementSchema: Schema = new Schema(
  {
    object_class: Number,
    checkpoint_id: String,
    confidence_score: Number,
    direction: String,
    measured_at: Date,
  },
  {
    collection: 'measurements',
    timestamps: true,
  }
)

export const Measurement: Model<IMeasurement> =
  models.Measurement || model<IMeasurement>('Measurement', MeasurementSchema)

export async function getMeasurements() {
  await db

  return Measurement.find({}).sort({ createdAt: -1 })
}

export async function createMeasurements(checkpoint, measurements) {
  await db

  let measurementObjects = measurements.map((measurement) => {
    return {
      object_class: measurement.object_class,
      checkpoint_id: checkpoint._id,
      confidence_score: measurement.confidence_score,
      direction: measurement.direction,
      measured_at: measurement.measured_at,
    }
  })

  return Measurement.insertMany(measurementObjects)
}

export async function getMeasurementsByCheckpointId(checkpoint_id) {
  await db

  return Measurement.find({ checkpoint_id: checkpoint_id }).sort({
    createdAt: -1,
  })
}
