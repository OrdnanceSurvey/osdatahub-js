import { describe, expect, test, beforeAll } from "@jest/globals";
import { getCRS } from "../build/utils/crs.js";

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

describe("Get valid CRS", () => {
  test("getCRS with string passes", async () => {
    expect(getCRS("epsg:27700")).toBe("epsg:27700");
  });

  test("getCRS with number passes", async () => {
    expect(getCRS(4326)).toBe("epsg:4326");
  });

  test("getCRS with uppercase string passes", async () => {
    expect(getCRS("WGS84")).toBe("wgs84");
  });
});
