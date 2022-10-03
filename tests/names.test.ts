import { describe, expect, test } from "@jest/globals";
import * as dotenv from "dotenv";
import { names } from "../src/names";

dotenv.config();

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    const point: [number, number] = [-1.471237, 50.938189];
    const apiKey = process.env.OS_API_KEY || "";
    let response = await names.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    const query = 'The Needles, Isle of Wight';
    const apiKey = process.env.OS_API_KEY || "";
    const options: { paging?: [number, number] } = {paging: [0, 100]}
    let response = await names.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});