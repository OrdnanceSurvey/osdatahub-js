import { describe, expect, test, beforeAll } from "@jest/globals";
import * as dotenv from "dotenv";
import { names } from "../src/names";

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

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    const point: [number, number] = [-1.471237, 50.938189];
    let response = await names.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });
  test("Nearest endpoing fails with invalid point", async () => {
    expect(await names.nearest(apiKey, [1000, 1000])).toThrow();
    // outside uk
    expect(await names.nearest(apiKey, [-12.720966,39.099627])).toThrow();
    // lat long flipped
    expect(await names.nearest(apiKey, [50.938189, -1.471237])).toThrow();
  })
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    const query = "The Needles, Isle of Wight";
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await names.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Postcode endpoint passes with non-standard paging", async () => {
    let query = "10 Downing Street, London, SW1";
    let response = await names.find(apiKey, query, {paging: [0, 10]});
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    response = await names.find(apiKey, query, {paging: [0, 1]});
    expect(response.features.length).toEqual(1);
  })

  test("Postcode endpoint fails with invalid paging", async () => {
    let query = "10 Downing Street, London, SW1";
    expect(await names.find(apiKey, query, {paging: [10, 0]})).toThrow();
    expect(await names.find(apiKey, query, {paging: [0, 100000]})).toThrow();
  })
});
