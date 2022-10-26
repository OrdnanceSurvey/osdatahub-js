import * as dotenv from "dotenv";

import { ngd } from "../build/ngd.js";

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
  const apiKey = process.env.OS_API_KEY
  const collectionId = "bld-fts-buildingline";
  let bbox= [-1.475335, 50.936159, -1.466924, 50.939569];
  let datetime = "2021-12-12T13:20:50Z/.."
  const options = { limit: 10, bbox, datetime };
  const response = await ngd.items(apiKey, collectionId, options);
  console.log(response.features[0].properties)
}

getData();
