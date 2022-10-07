import { describe, expect, test, beforeAll } from "@jest/globals";
import * as dotenv from "dotenv";
import { ngd } from "../build/ngd.js";

dotenv.config();

let apiKey: string;
beforeAll(() => {
  if (typeof process.env.OS_API_KEY === "string") {
    apiKey = process.env.OS_API_KEY;
  } else {
    throw Error(
      "OS_API_KEY not provided. Make sure you provide a valid api" +
        "key either throw your environment variables or a .env file"
    );
  }
});

// eslint-disable-next-line @typescript-eslint/ban-types
async function testError(callback: Function): Promise<any> {
  let error: any;
  try {
    await callback();
  } catch (e: any) {
    error = e;
  }
  return error;
}

describe("Items Endpoint", () => {
  test("Items Endpoint Passes", async () => {
    const collectionId = "bld-fts-buildingline";
    const options = { limit: 10 };
    const response = await ngd.items(apiKey, collectionId, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

// describe("Collections Endpoint", () => {
//   test("Collections Endpoint Passes w/o collectionId", async () => {
//     const response = await ngd.collections();
//     expect(response.features.length).toBeGreaterThanOrEqual(1);
//   });

//   test("Collections Endpoint Passes w/ collectionId", async () => {
//     const response = await ngd.collections("bld-fts-buildingline");
//     expect(response.features.length).toBeGreaterThanOrEqual(1);
//   });
// });

// describe("Schema Endpoint", () => {
//   test("Schema Endpoint Passes ", async () => {
//     const response = await ngd.schema("bld-fts-buildingline");
//     expect(response.features.length).toBeGreaterThanOrEqual(1);
//   });
// });

// describe("Queryable Endpoint", () => {
//   test("Queryable Endpoint Passes ", async () => {
//     const response = await ngd.queryable("bld-fts-buildingline");
//     expect(response.features.length).toBeGreaterThanOrEqual(1);
//   });
// });

// describe("BBox Endpoint", () => {
//   test("BBox Endpoint Passes", async () => {
//     const collectionId = "bld-fts-buildingline";
//     const bbox = [-1.475335, 50.936159, -1.466924, 50.939569];
//     const options = { limit: 10 };
//     const response = ngd.bbox(collectionId, bbox, options);
//     expect(response.features.length).toEqual(1);
//   });
// });

// describe("Feature Endpoint", () => {
//   test("Feature Endpoint Passes", async () => {
//     const collectionId = "bld-fts-buildingline";
//     const featureId = "11111111-1111-1111-1111-111111111111";
//     const response = ngd.feature(collectionId, featureId);
//     expect(response.features.length).toEqual(1);
//   });
// });
