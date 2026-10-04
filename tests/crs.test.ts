import { describe, expect, test } from "@jest/globals";
import { getCRS } from "../build/utils/crs.js";
import { testError } from "./utils";

describe("Get valid CRS", () => {
  test("getCRS with string passes", () => {
    expect(getCRS("epsg:27700")).toBe(
      "http://www.opengis.net/def/crs/EPSG/0/27700",
    );
  });

  test("getCRS with number passes", () => {
    expect(getCRS(4326)).toBe("http://www.opengis.net/def/crs/EPSG/0/4326");
  });

  test("getCRS with uppercase string passes", () => {
    expect(getCRS("WGS84")).toBe(
      "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
    );
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
