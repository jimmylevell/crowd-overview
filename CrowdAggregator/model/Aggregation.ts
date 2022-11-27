import mongoose, { Document, model, models, Model, Schema } from "mongoose";
import db from "../utils/db";

export interface IAggregation extends Document {
  _id: string;
  object_class: number;
  checkpoint_id: string;
  direction: string;
  count: number;
  aggregated_at: Date;
}

const AggregationSchema: Schema = new Schema(
  {
    object_class: Number,
    checkpoint_id: String,
    direction: String,
    count: Number,
    aggregated_at: Date,
  },
  {
    collection: "aggregations",
    timestamps: true,
  }
);

const Aggregation: Model<IAggregation> =
  models.Aggregation || model<IAggregation>("Aggregation", AggregationSchema);

export async function addAggregations(
  aggregations: any,
  aggregated_at: Date,
  chunkNumber: number
) {
  console.log(
    "Adding aggregations " +
      aggregated_at +
      ", chunk " +
      chunkNumber +
      " to database"
  );
  console.log(aggregations);
  await db;

  const aggregationDocs = Object.keys(aggregations).map((checkpoint_id) => {
    const objectClasses = aggregations[checkpoint_id];

    return Object.keys(objectClasses).map((object_class) => {
      const directions = objectClasses[object_class];

      return Object.keys(directions).map((direction) => {
        const count = directions[direction];

        // 5 minutes per chunk
        const chunkAggregationTime = aggregated_at.setMinutes(
          aggregated_at.getMinutes() + 5 * chunkNumber
        );
        return {
          checkpoint_id,
          object_class,
          direction,
          count,
          chunkAggregationTime,
        };
      });
    });
  });

  return Aggregation.insertMany(aggregationDocs.flat().flat());
}
