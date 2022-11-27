import { AzureFunction, Context } from "@azure/functions";
import Pusher from "pusher";
import { getMeasurements, removeMeasurements } from "../model/Measurement";
import { addAggregations } from "../model/Aggregation";

const SLOT_SIZE = 600;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "eu",
  useTLS: true,
});

const notifyAggregations = (aggregations: any) => {
  pusher.trigger("aggregations", "new_aggregations", {
    aggregations: aggregations,
  });

  Object.keys(aggregations).forEach((checkpoint_id) => {
    pusher.trigger("aggregations", "new_aggregations_" + checkpoint_id, {
      aggregations: aggregations[checkpoint_id],
    });
  });
};

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const measurements = await getMeasurements();
  const AGGREGATION_TIME = measurements[0].measured_at;

  // create chunks based on slot size
  for (
    let chunkNumber = 0;
    chunkNumber < measurements.length;
    chunkNumber += SLOT_SIZE
  ) {
    const chunk = measurements.slice(chunkNumber, chunkNumber + SLOT_SIZE);

    const aggregations = chunk.reduce((p, c) => {
      let checkpoint_id: any = c.checkpoint_id;
      let object_class: any = c.object_class;
      let direction: any = parseFloat(c.direction) > 0 ? "in" : "out";

      if (!p[checkpoint_id]) {
        p[checkpoint_id] = {};
      }

      if (!p[checkpoint_id].hasOwnProperty(object_class)) {
        p[checkpoint_id][object_class] = {};
      }

      if (!p[checkpoint_id][object_class].hasOwnProperty(direction)) {
        p[checkpoint_id][object_class][direction] = 0;
      }

      p[checkpoint_id][object_class][direction] =
        p[checkpoint_id][object_class][direction] + 1;

      return p;
    }, {});

    await addAggregations(aggregations, AGGREGATION_TIME, chunkNumber);
    //await removeMeasurements(measurements);
    notifyAggregations(aggregations);
  }
};

export default timerTrigger;
