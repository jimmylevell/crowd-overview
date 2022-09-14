import mongoose, { Document, model, models, Model, Schema } from "mongoose";
import db from "../utils/db";

export interface IAggregation extends Document {
  _id: String;
  object_class: Number;
  checkpoint_id: String;
  direction: String;
  aggregated_at: Date;
}

const AggregationSchema: Schema = new Schema(
  {
    object_class: Number,
    checkpoint_id: String,
    direction: String,
    aggregated_at: Date,
  },
  {
    collection: "aggregations",
    timestamps: true,
  }
);

const Aggregation: Model<IAggregation> =
  models.Aggregation || model<IAggregation>("Aggregation", AggregationSchema);

export async function addAggregations(aggregations: any) {
  console.log(aggregations);
  await db;

  const aggregationDocs = Object.keys(aggregations).map((checkpoint_id) => {
    const objectClasses = aggregations[checkpoint_id];

    return Object.keys(objectClasses).map((object_class) => {
      const directions = objectClasses[object_class];

      return Object.keys(directions).map((direction) => {
        const count = directions[direction];

        return {
          checkpoint_id,
          object_class,
          direction,
          count,
        };
      });
    });
  });

  return Aggregation.insertMany(aggregationDocs.flat().flat());
}
