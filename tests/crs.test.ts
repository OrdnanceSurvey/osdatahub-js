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
  test("getCRS with string passes", () => {
    expect(getCRS("epsg:27700")).toBe("epsg:27700");
  });

  test("getCRS with number passes", () => {
    expect(getCRS(4326)).toBe("epsg:4326");
  });

  test("getCRS with uppercase string passes", () => {
    expect(getCRS("WGS84")).toBe("wgs84");
  });

  test("getCRS fails for unsupported epsg", async () => {
    const error = await testError(() => getCRS(34599));
    expect(error).toEqual(new Error("Unrecognised CRS"));
  });

  test("getCRS fails for unrecognisable string", async () => {
    const error = await testError(() => getCRS("british national grid"));
    expect(error).toEqual(new Error("Unrecognised CRS"));
  });
});
