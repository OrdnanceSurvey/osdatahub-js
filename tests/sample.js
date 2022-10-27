import * as dotenv from "dotenv";

import { ngd } from "../build/ngd.js";
import * as filters from "../build/filters/filters.js";

dotenv.config();

const polygon = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-1.4730370044708252, 50.936113462996616],
            [-1.4670073986053467, 50.936113462996616],
            [-1.4670073986053467, 50.93952096686167],
            [-1.4730370044708252, 50.93952096686167],
            [-1.4730370044708252, 50.936113462996616],
          ],
        ],
      },
    },
  ],
};

async function getData() {
  const apiKey = process.env.OS_API_KEY;
  const collectionId = "bld-fts-buildingpart";
  const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
  const propertyFilter = filters.and(
    filters.greaterThanOrEqual("relativeheightmaximum", 10),
    filters.equals("oslandusetiera", "Unknown Or Unused Artificial")
  );
  const options = { limit: 4, bbox, filter: propertyFilter };
  const response = await ngd.features(apiKey, collectionId, options);
  console.log(response);
}

getData();
