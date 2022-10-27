// @ts-ignore
import { describe, expect, test, beforeAll } from "@jest/globals";
import {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Position,
} from "geojson";
// @ts-ignore
import * as dotenv from "dotenv";
// @ts-ignore
import { ngd } from "../build/ngd.js";
import * as filters from "../build/filters/filters";
import { type BBox } from "../src/types.js";

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

function checkInBounds(coordinate: Position, bbox: BBox) {
  expect(coordinate[0]).toBeGreaterThanOrEqual(bbox[0]);
  expect(coordinate[0]).toBeLessThanOrEqual(bbox[2]);
  expect(coordinate[1]).toBeGreaterThanOrEqual(bbox[1]);
  expect(coordinate[1]).toBeLessThanOrEqual(bbox[3]);
}

function checkLinesInBounds(featureCollection: FeatureCollection, bbox: BBox) {
  featureCollection.features.forEach((line: Feature) => {
    const coords = (line.geometry as LineString).coordinates;
    coords.forEach((coord) => {
      checkInBounds(coord, bbox);
    });
  });
}

describe("Features Endpoint", () => {
  test("Items Endpoint Passes", async () => {
    const collectionId = "bld-fts-buildingline";
    const options = { limit: 10 };
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(10);
  });

  test("Features with bbox", async () => {
    const collectionId = "bld-fts-buildingline";
    const bbox: BBox = [-1.475335, 50.936159, -1.466924, 50.939569];
    const options = { limit: 4, bbox };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    checkLinesInBounds(response, bbox);
  });

  test("Features fails with invalid BBox", async () => {
    const collectionId = "bld-fts-buildingline";

    // West and East are switched
    let error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, {
        bbox: [-1.907287, 52.479173, -1.917543, 52.485211],
      });
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      )
    );

    // North and South are switched
    error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, {
        bbox: [-1.917543, 52.485211, -1.907287, 52.479173],
      });
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      )
    );

    // // Obviously not latitude and longitude
    error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, {
        bbox: [-1000, 0, 1000, 500],
      });
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );

    // // Invalid latitude values (need to be -90 <= x <= 90)
    error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, {
        bbox: [-1, 100, 1, 120],
      });
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );
  });

  test("Features with datetime", async () => {
    const collectionId = "bld-fts-buildingline";
    const datetime = "2022-06-12T13:20:50Z/..";
    const options = { limit: 4, datetime };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1); // TODO: Test after datetime
  });
});

describe("Features with filters", () => {
  test("Like", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
    const propertyFilter = filters.like("description", "Archway%");
    const options = { limit: 4, bbox, filter: propertyFilter };
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features[0].properties.description).toBe("Archway");
  });

  test("Equals", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
    const propertyFilter = filters.equals("description", "Building");
    const options = { limit: 4, bbox, filter: propertyFilter };
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features[0].properties.description).toBe("Building");
  });

  test("Between", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
    const propertyFilter = filters.between("geometry_area", 30, 60);
    const options = { limit: 4, bbox, filter: propertyFilter };
    const response = await ngd.features(apiKey, collectionId, options);
    const geometry_area = response.features[0].properties.geometry_area;
    expect(geometry_area).toBeGreaterThanOrEqual(30);
    expect(geometry_area).toBeLessThanOrEqual(60);
  });

  test("Greater than or equal to", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
    const propertyFilter = filters.greaterThanOrEqual(
      "relativeheightmaximum",
      20
    );
    const options = { limit: 4, bbox, filter: propertyFilter };
    const response = await ngd.features(apiKey, collectionId, options);
    expect(
      response.features[0].properties.relativeheightmaximum
    ).toBeGreaterThanOrEqual(20);
  });

  test("And", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [-3.545148, 50.727083, -3.53847, 50.728095];
    const propertyFilter = filters.and(
      filters.greaterThanOrEqual("relativeheightmaximum", 10),
      filters.equals("oslandusetiera", "Unknown Or Unused Artificial")
    );
    const options = { limit: 4, bbox, filter: propertyFilter };
    const response = await ngd.features(apiKey, collectionId, options);
    expect(
      response.features[0].properties.relativeheightmaximum
    ).toBeGreaterThanOrEqual(10);
    expect(response.features[0].properties.oslandusetiera).toBe(
      "Unknown Or Unused Artificial"
    );
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
