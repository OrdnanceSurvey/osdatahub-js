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
import { validateParams, datetimeError } from "../src/utils/ngd/validate";

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

function checkNotWGS84(coordinate: Position) {
  expect(Math.abs(coordinate[0])).toBeGreaterThan(180);
  expect(Math.abs(coordinate[1])).toBeGreaterThan(180);
}

function checkPointsNotWGS84(featureCollection: FeatureCollection) {
  featureCollection.features.forEach((point: Feature) => {
    const coord = (point.geometry as Point).coordinates;
    checkNotWGS84(coord);
  });
}

describe("Features Endpoint Fails", () => {
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

  test("Features fails with invalid bbox", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox: BBox = [-1.466924, 50.939569, -1.475335, 50.936159];
    const options = { bbox, limit: 1 };
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId, options);
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      )
    );
  });

  test("Features fails with invalid key", async () => {
    const collectionId = "bld-fts-buildingpart";
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features("uselesskey", collectionId);
    });
    expect(error).toEqual(new Error("Invalid API Key"));
  });

  test("Features fails with invalid collectionId", async () => {
    const collectionId = "bld-fts-buildingpjart";
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.features(apiKey, collectionId);
    });
    expect(error).toEqual(
      new Error(
        "The feature collection 'bld-fts-buildingpjart' could not be found. Please check it is a supported collection."
      )
    );
  });
});

describe("Features Endpoint Passes", () => {
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

  test("Features with open interval datetime [forwards]", async () => {
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
    expect(response.features).toHaveLength(1);
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
    const collectionId = "gnm-fts-namedpoint";
    const crs = 27700;
    const options = { crs, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    checkPointsNotWGS84(response);
  });

  test("Features with string crs", async () => {
    const collectionId = "gnm-fts-namedpoint";
    const crs = "epsg:3857";
    const options = { crs, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    checkPointsNotWGS84(response);
  });

  test("Features with bboxCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const bbox = [474976, 260490, 475976, 261490];
    const bboxCRS = 27700;
    const options = { bboxCRS, bbox, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features).toHaveLength(1);
  });

  test("Features with filterCRS", async () => {
    const collectionId = "bld-fts-buildingpart";
    const filter =
      "INTERSECTS(geometry, POLYGON((474976 260490, 475976 260490, 475976 261490, 474976 261490, 474976 260490)))";
    const filterCRS = 27700;
    const options = { filterCRS, filter, limit: 1 };
    // @ts-ignore
    const response = await ngd.features(apiKey, collectionId, options);
    expect(response.features).toHaveLength(1);
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
    const collectionId = "gnm-fts-namedpoint";
    const featureId = "000025d4-b5f8-454b-9229-a2d56601ecc3";
    const crs = 27700;
    const options = { crs };
    const response = await ngd.feature(
      apiKey,
      collectionId,
      featureId,
      // @ts-ignore
      options
    );
    checkNotWGS84(response.geometry.coordinates);
  });

  test("Feature with string crs", async () => {
    const collectionId = "gnm-fts-namedpoint";
    const featureId = "000025d4-b5f8-454b-9229-a2d56601ecc3";
    const crs = "epsg:3857";
    const options = { crs };
    const response = await ngd.feature(
      apiKey,
      collectionId,
      featureId,
      // @ts-ignore
      options
    );
    checkNotWGS84(response.geometry.coordinates);
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

  test("Feature fails with invalid key", async () => {
    const collectionId = "bld-fts-buildingline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.feature("uselesskey", collectionId, featureId);
    });
    expect(error).toEqual(new Error("Invalid API Key"));
  });

  test("Feature fails with invalid collectionId", async () => {
    const collectionId = "bld-fts-buildingsline";
    const featureId = "00000016-e0a2-45ca-855a-645753d72716";
    // @ts-ignore
    const error = await testError(async () => {
      // @ts-ignore
      return await ngd.feature(apiKey, collectionId, featureId);
    });
    expect(error).toEqual(
      new Error(
        "The feature collection 'bld-fts-buildingsline' could not be found. Please check it is a supported collection."
      )
    );
  });
});

describe("Validation", () => {
  test("datetime - single", () => {
    const datetime = "2021-12-12T23:20:50Z";
    expect(validateParams({ datetime })).toBeTruthy();
  });

  test("datetime - open forward", () => {
    const datetime = "2021-12-12T23:20:50Z/..";
    expect(validateParams({ datetime })).toBeTruthy();
  });

  test("datetime - open forward (no dots)", () => {
    const datetime = "2021-12-12T23:20:50Z/";
    expect(validateParams({ datetime })).toBeTruthy();
  });

  test("datetime - open backward", () => {
    const datetime = "../2021-12-12T23:20:50Z";
    expect(validateParams({ datetime })).toBeTruthy();
  });

  test("datetime - closed", () => {
    const datetime = "2021-04-12T23:20:50Z/2021-12-12T23:20:50Z";
    expect(validateParams({ datetime })).toBeTruthy();
  });

  test("datetime - fail single dot", async () => {
    const datetime = "2021-04-12T23:20:50Z/.";
    const error = await testError(() => {
      // @ts-ignore
      return validateParams({ datetime });
    });
    expect(error).toEqual(datetimeError());
  });

  test("datetime - fail incorrect year", async () => {
    const datetime = "21-04-12T23:20:50Z";
    const error = await testError(() => {
      // @ts-ignore
      return validateParams({ datetime });
    });
    expect(error).toEqual(datetimeError());
  });
});
