import { describe, expect, test, beforeAll } from "@jest/globals";
import {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Position,
} from "geojson";
import * as dotenv from "dotenv";
import { ngd } from "../build/ngd.js";
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

function checkPointsInBounds(featureCollection: FeatureCollection, bbox: BBox) {
  featureCollection.features.forEach((point: Feature) => {
    const coord = (point.geometry as Point).coordinates;
    checkInBounds(coord, bbox);
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

  test("Features with spatial filter - Point", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filter = "INTERSECTS(geometry, POINT(-3.541582 50.727613))";
    const options = { filter };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(1);
  });

  test("Features with spatial filter - Polygon", async () => {
    const collectionId = "gnm-fts-namedpoint";
    const filter =
      "INTERSECTS(geometry, POLYGON((-3.54248 50.727334,-3.54248 50.727844,-3.541138 50.727844,-3.541138 50.727334,-3.54248 50.727334)))";
    const options = { filter, limit: 5 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    checkPointsInBounds(response, [-3.54248, 50.727334, -3.541138, 50.727844]);
  });

  test("Features with comparison filter - equals", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filter = "description = 'Building'";
    const options = { filter, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features[0].properties.description).toBe("Building");
  });

  test("Features with comparison filter - equals", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filter = "description = 'Building'";
    const options = { filter, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features[0].properties.description).toBe("Building");
  });

  test("Features with epsg crs", async () => {
    const collectionId = "bld-fts-buildingpart";
    const crs = 27700;
    const options = { crs, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(1); // TODO: Check coords change to CRS
  });

  test("Features with string crs", async () => {
    const collectionId = "bld-fts-buildingpart";
    const crs = "epsg:3857";
    const options = { crs, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(1); // TODO: Check coords change to CRS
  });

  test("Features fails with invalid crs", async () => {
    const collectionId = "bld-fts-buildingpart";
    const crs = "epsg:3857v5";
    const options = { crs, limit: 1 };
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, options);
    });
    expect(error).toEqual(new Error("Unrecognised CRS"));
  });

  test("Features with bboxCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bboxCRS = 27700;
    const options = { bboxCRS, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(1); // TODO: Check coords change to CRS
  });

  test("Features fails with invalid bboxCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bboxCRS = "epsg:3857v5";
    const options = { bboxCRS, limit: 1 };
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, options);
    });
    expect(error).toEqual(new Error("Unrecognised CRS"));
  });

  test("Features with filterCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filterCRS = 27700;
    const options = { filterCRS, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features.length).toEqual(1); // TODO: Check coords change to CRS
  });

  test("Features fails with invalid filterCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filterCRS = "epsg:3s7v5";
    const options = { filterCRS, limit: 1 };
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, options);
    });
    expect(error).toEqual(new Error("Unrecognised CRS"));
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

  test("Features with epsg crs", async () => {
    const collectionId = "bld-fts-buildingline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    const crs = 27700;
    const options = { crs };
    const response = await ngd.feature(
      apiKey,
      collectionId,
      featureId,
      // @ts-ignore
      options
    );
    expect(response.id).toBe(featureId); // TODO: Check coords change to CRS
  });

  test("Feature with string crs", async () => {
    const collectionId = "bld-fts-buildingline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    const crs = "epsg:3857";
    const options = { crs };
    const response = await ngd.feature(
      apiKey,
      collectionId,
      featureId,
      // @ts-ignore
      options
    );
    expect(response.id).toBe(featureId); // TODO: Check coords change to CRS
  });

  test("Feature fails with invalid crs", async () => {
    const collectionId = "bld-fts-buildingline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    const crs = "epsg:3857v5";
    const options = { crs };
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.feature(apiKey, collectionId, featureId, options);
    });
    expect(error).toEqual(new Error("Unrecognised CRS"));
  });
});
