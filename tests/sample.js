import * as dotenv from "dotenv";

import { places } from "../build/index.js"

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
  // eslint-disable-next-line no-undef
  let theData = await places.polygon(process.env.OS_API_KEY, polygon);

  let theDataParsed = JSON.stringify(theData);

  console.log(theDataParsed)

  // fs.writeFile("tests/output.geojson", theDataParsed, function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  // });
}

getData();
