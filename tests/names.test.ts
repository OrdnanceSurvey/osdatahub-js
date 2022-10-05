import { describe, expect, test, beforeAll } from "@jest/globals";
import * as dotenv from "dotenv";
import { names } from "../build/names.js";

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

async function testError(callback: Function): Promise<any> {
  let error: any;
  try {
    await callback();
  } catch (e: any) {
    error = e;
  }
  return error;
}

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    const point: [number, number] = [-1.471237, 50.938189];
    let response = await names.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });

  test("Nearest Endpoint Passes with Lat Lng point", async () => {
    let point: [number, number] = [50.938189, -1.471237];
    let response = await names.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);

    point = [-1.924796, 52.47918];
    response = await names.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });

  test("Nearest endpoing fails with invalid point", async () => {
    let error = await testError(async () => {
      return await names.nearest(apiKey, [-12.720966, 39.099627]);
    });
    expect(error).toEqual(
      new Error(
        "Invalid Point, not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );
  });
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    const query = "The Needles, Isle of Wight";
    const options: { offset?: number; limit?: number } = { limit: 5 };
    let response = await names.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Postcode endpoint passes with non-standard paging", async () => {
    let query = "10 Downing Street, London, SW1";
    let response = await names.find(apiKey, query, { limit: 4 });
    expect(response.features.length).toEqual(4);

    response = await names.find(apiKey, query, { limit: 3, offset: 9 });
    expect(response.features.length).toEqual(3);
  });
});
