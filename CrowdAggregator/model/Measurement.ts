import mongoose, { Document, model, models, Model, Schema } from "mongoose";
import db from "../utils/db";

export interface IMeasurement extends Document {
  _id: String;
  object_class: Number;
  checkpoint_id: String;
  confidence_score: Number;
  direction: String;
  measured_at: Date;
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
    collection: "measurements",
    timestamps: true,
  }
);

export const Measurement: Model<IMeasurement> =
  models.Measurement || model<IMeasurement>("Measurement", MeasurementSchema);

export async function getMeasurements() {
  await db;

  return Measurement.find({}).sort({ createdAt: -1 });
}

export async function removeMeasurements(measurements: IMeasurement[]) {
  await db;

  return Measurement.deleteMany({
    _id: {
      $in: measurements.map((measurement) => measurement._id),
    },
  });
}
