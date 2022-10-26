// @ts-ignore
import { describe, expect, test, beforeAll } from "@jest/globals";
// @ts-ignore
import * as dotenv from "dotenv";
// @ts-ignore
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

describe("Collections Endpoint", () => {
  test("Collections Endpoint Passes w/o collectionId", async () => {
    const response = await ngd.collections();
    expect(response.collections.length).toBeGreaterThanOrEqual(1);
  });

  test("Collections Endpoint Passes w/ collectionId", async () => {
    const response = await ngd.collections("bld-fts-buildingline");
    expect(response.id).toBe("bld-fts-buildingline");
  });
});

describe("Schema Endpoint", () => {
  test("Schema Endpoint Passes ", async () => {
    const response = await ngd.schema("bld-fts-buildingline");
    expect(response).toHaveProperty("properties");
  });
});

describe("Queryables Endpoint", () => {
  test("Queryables Endpoint Passes ", async () => {
    const response = await ngd.queryables("bld-fts-buildingline");
    expect(response).toHaveProperty("properties");
  });
});

describe("Feature Endpoint", () => {
  test("Feature Endpoint Passes", async () => {
    const collectionId = "bld-fts-buildingline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    const response = await ngd.feature(apiKey, collectionId, featureId);
    expect(response.id).toBe(featureId);
  });
});
