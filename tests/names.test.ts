import { describe, expect, test } from "@jest/globals";
import * as dotenv from "dotenv";
import { names } from "../src/names";

dotenv.config();


describe("Nearest Endpoint", () => {
    test("Nearest Endpoint Passes", async () => {
      const point = [-1.471237, 50.938189];
      const apiKey = process.env.OS_API_KEY;
      let response = await names.nearest(apiKey, point);
      expect(response.features.length).toEqual(1);
    });
  });