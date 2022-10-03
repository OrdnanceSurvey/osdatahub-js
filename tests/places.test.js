import { describe, expect, test } from "@jest/globals";
import * as dotenv from "dotenv";
import { places } from "../src/places";

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

describe("Polygon Endpoint", () => {
  test("Polygon Endpoint Passes", async () => {
    const apiKey = process.env.OS_API_KEY;
    const options = { paging: [0, 100] };
    let response = await places.polygon(apiKey, polygon, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Radius Endpoint", () => {
  test("Radius Endpoint Passes", async () => {
    const apiKey = process.env.OS_API_KEY;
    const center = [-1.4730370044708252, 50.936113462996616];
    const radius = 200;
    const options = { paging: [0, 100] };
    let response = await places.radius(apiKey, center, radius, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("BBox Endpoint", () => {
  test("BBox Endpoint Passes", async () => {
    const bbox = [-1.475335, 50.936159, -1.466924, 50.939569];
    const apiKey = process.env.OS_API_KEY;
    const options = { paging: [0, 100] };
    let response = await places.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    const point = [-1.471237, 50.938189];
    const apiKey = process.env.OS_API_KEY;
    let response = await places.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });
});

describe("UPRN Endpoint", () => {
  test("UPRN endpoint passes", async () => {
    const uprn = 200010019924;
    const apiKey = process.env.OS_API_KEY;
    let response = await places.uprn(apiKey, uprn);
    expect(response.features.length).toEqual(1);
  });
});

describe("Postcode Endpoint", () => {
  test("Postcode Endpoint Passes", async () => {
    const postcode = "SO16 0AS";
    const apiKey = process.env.OS_API_KEY;
    const options = { paging: [0, 100] };
    let response = await places.postcode(apiKey, postcode, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    const query = "10 Downing Street, London, SW1";
    const apiKey = process.env.OS_API_KEY;
    const options = { paging: [0, 100] };
    let response = await places.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});
