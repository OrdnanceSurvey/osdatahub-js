import { type BBox } from "../src/types";
import { describe, expect, test, beforeAll, jest } from "@jest/globals";
import * as dotenv from "dotenv";
import { placesAPI } from "../build/index.js";
import { Feature, FeatureCollection, Polygon } from "geojson";
import { testError } from "./utils";

dotenv.config();

const featureCollection: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-1.4730370044708252, 50.936113462996616],
            [-1.4670073986053467, 50.936113462996616],
            [-1.4670073986053467, 50.93952096686167],
            [-1.4730370044708252, 50.93952096686167],
            [-1.4730370044708252, 50.936113462996616],
          ],
        ],
      },
    },
  ],
};

const point: Feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: [-1.4730370044708252, 50.936113462996616],
  },
};

const polygon: Polygon = {
  type: "Polygon",
  coordinates: [
    [
      [-1.4730370044708252, 50.936113462996616],
      [-1.4670073986053467, 50.936113462996616],
      [-1.4670073986053467, 50.93952096686167],
      [-1.4730370044708252, 50.93952096686167],
      [-1.4730370044708252, 50.936113462996616],
    ],
  ],
};

const invalidPolygon: Polygon = {
  type: "Polygon",
  coordinates: [
    [
      [50.936113462996616, -1.4730370044708252],
      [50.936113462996616, -1.4670073986053467],
      [50.93952096686167, -1.4670073986053467],
      [50.93952096686167, -1.4730370044708252],
      [50.936113462996616, -1.4730370044708252],
    ],
  ],
};

jest.setTimeout(50000);
let apiKey: string;
beforeAll(() => {
  if (typeof process.env.OS_API_KEY === "string") {
    apiKey = process.env.OS_API_KEY;
  } else {
    throw Error(
      "OS_API_KEY not provided. Make sure you provide a valid api key either throw your environment variables" +
        "or a .env file"
    );
  }
});

describe("Polygon Endpoint", () => {
  test("Polygon Endpoint With FeatureCollection", async () => {
    const options: { offset?: number; limit?: number } = {
      offset: 0,
      limit: 5,
    };

    const response = await placesAPI.polygon(
      apiKey,
      <FeatureCollection>featureCollection,
      options
    );
    const requiredProperties = ["features", "header", "type"];
    requiredProperties.map((prop: string) =>
      expect(response).toHaveProperty(prop)
    );
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Polygon endpoint passes with Polygon object", async () => {
    const options: { offset?: number; limit?: number } = {
      offset: 0,
      limit: 5,
    };
    const response = await placesAPI.polygon(apiKey, <Polygon>polygon, options);
    const requiredProperties = ["features", "header", "type"];
    requiredProperties.map((prop: string) =>
      expect(response).toHaveProperty(prop)
    );
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Polygon endpoint passes with specific numbers of results", async () => {
    const requiredProperties = ["features", "header", "type"];

    const options: { offset?: number; limit?: number } = { limit: 7 };
    const response = await placesAPI.polygon(
      apiKey,
      featureCollection,
      options
    );
    requiredProperties.map((prop: string) =>
      expect(response).toHaveProperty(prop)
    );
    expect(response.features.length).toEqual(7);
  });

  test("Polygon endpoint fails with point", async () => {
    const options: { offset?: number; limit?: number } = { limit: 5 };
    const error = await testError(async () => {
      return await placesAPI.polygon(apiKey, point, options);
    });
    expect(error).toEqual(new Error("Expected Polygon, got Point"));
  });

  test("Polygon endpoint enpoint succeeds with lat lng geometries", async () => {
    const options: { offset?: number; limit?: number } = {
      offset: 0,
      limit: 5,
    };
    const response = await placesAPI.polygon(apiKey, invalidPolygon, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Radius Endpoint", () => {
  test("Radius Endpoint Passes", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    const options: { offset?: number; limit?: number } = { limit: 7 };
    const response = await placesAPI.radius(apiKey, center, 200, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Radius Endpoint passes with non-standard numbers of results", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    const radius = 500;
    let response = await placesAPI.radius(apiKey, center, radius, { limit: 7 });
    expect(response.features.length).toEqual(7);

    response = await placesAPI.radius(apiKey, center, radius, {
      offset: 5,
      limit: 2,
    });
    expect(response.features.length).toEqual(2);
  });

  test("Radius Endpoint fails with invalid radius", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    const options: { offset?: number; limit?: number } = { limit: 5 };

    let error = await testError(async () => {
      return await placesAPI.radius(apiKey, center, -1, options);
    });
    expect(error).toEqual(
      new RangeError("Radius must be an integer between 1-1000m")
    );

    error = await testError(async () => {
      return await placesAPI.radius(apiKey, center, 5000, options);
    });
    expect(error).toEqual(
      new RangeError("Radius must be an integer between 1-1000m")
    );

    error = await testError(async () => {
      return await placesAPI.radius(apiKey, center, 0.001, options);
    });
    expect(error).toEqual(
      new Error("Radius must be an integer between 1-1000m")
    );
  });

  test("Radius enpoint succeeds with lat lng geometries", async () => {
    const center: [number, number] = [50.936113462996616, -1.4730370044708252];
    const options: { offset?: number; limit?: number } = { limit: 7 };
    const response = await placesAPI.radius(apiKey, center, 200, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });
});

describe("BBox Endpoint", () => {
  test("BBox Endpoint Passes", async () => {
    let bbox: BBox = [-1.475335, 50.936159, -1.466924, 50.939569];
    const options: { offset?: number; limit?: number } = { limit: 5 };
    let response = await placesAPI.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    bbox = [-1.917543, 52.479173, -1.907287, 52.485211];
    response = await placesAPI.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("BBox endpoint passes with non-standard paging", async () => {
    const bbox: BBox = [-1.475335, 50.936159, -1.466924, 50.939569];

    let response = await placesAPI.bbox(apiKey, bbox, { limit: 5 });
    expect(response.features.length).toEqual(5);

    response = await placesAPI.bbox(apiKey, bbox, { offset: 7, limit: 2 });
    expect(response.features.length).toEqual(2);
  });

  test("BBox Endpoint Passes with Lat Lng bounds", async () => {
    let bbox: BBox = [50.936159, -1.475335, 50.939569, -1.466924];
    const options: { offset?: number; limit?: number } = { limit: 5 };
    let response = await placesAPI.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    bbox = [-1.917543, 52.479173, -1.907287, 52.485211];
    response = await placesAPI.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("BBox endpoint fails with invalid BBox", async () => {
    const options: { offset?: number; limit?: number } = { limit: 5 };

    // West and East are switched
    let error = await testError(async () => {
      return await placesAPI.bbox(
        apiKey,
        [-1.907287, 52.479173, -1.917543, 52.485211],
        options
      );
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      )
    );

    // North and South are switched
    error = await testError(async () => {
      return await placesAPI.bbox(
        apiKey,
        [-1.917543, 52.485211, -1.907287, 52.479173],
        options
      );
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      )
    );

    // // Obviously not latitude and longitude
    error = await testError(async () => {
      return await placesAPI.bbox(apiKey, [-1000, 0, 1000, 500], options);
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );

    // // Invalid latitude values (need to be -90 <= x <= 90)
    error = await testError(async () => {
      return await placesAPI.bbox(apiKey, [-1, 100, 1, 120], options);
    });
    expect(error).toEqual(
      new Error(
        "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );
  });
});

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    let point: [number, number] = [-1.471237, 50.938189];
    let response = await placesAPI.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);

    point = [-1.924796, 52.47918];
    response = await placesAPI.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });

  test("Nearest Endpoint Passes with Lat Lng point", async () => {
    let point: [number, number] = [50.938189, -1.471237];
    let response = await placesAPI.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);

    point = [-1.924796, 52.47918];
    response = await placesAPI.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });

  test("Nearest endpoing fails with invalid point", async () => {
    const error = await testError(async () => {
      return await placesAPI.nearest(apiKey, [-12.720966, 39.099627]);
    });
    expect(error).toEqual(
      new Error(
        "Invalid Point, not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
      )
    );
  });
});

describe("UPRN Endpoint", () => {
  test("UPRN endpoint passes", async () => {
    const uprn = 200010019924;
    const response = await placesAPI.uprn(apiKey, uprn);
    expect(response.features.length).toEqual(1);
  });

  test("UPRN endpoint fails with invalid UPRN", async () => {
    // can't be a negative number
    let error = await testError(async () => {
      return await placesAPI.uprn(apiKey, -1000);
    });
    expect(error).toEqual(
      new Error("Invalid UPRN, should be a positive integer (max. 12 digits)")
    );

    // can't be a decimal
    error = await testError(async () => {
      return await placesAPI.uprn(apiKey, 1.2345);
    });
    expect(error).toEqual(
      new Error("Invalid UPRN, should be a positive integer (max. 12 digits)")
    );

    // can't be greater than 12 characters
    error = await testError(async () => {
      return await placesAPI.uprn(apiKey, 1234567890123);
    });
    expect(error).toEqual(
      new Error("Invalid UPRN, should be a positive integer (max. 12 digits)")
    );
  });
});

describe("Postcode Endpoint", () => {
  test("Postcode Endpoint Passes", async () => {
    let postcode = "SO16 0AS";
    const options: { offset?: number; limit?: number } = { limit: 1 };
    let response = await placesAPI.postcode(apiKey, postcode, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    postcode = "KT11 3BB";
    response = await placesAPI.postcode(apiKey, postcode, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    postcode = "SO16";
    response = await placesAPI.postcode(apiKey, postcode, { limit: 5 });
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Postcode Endpoint fails with invalid postcode", async () => {
    const options: { offset?: number; limit?: number } = { limit: 5 };
    let error = await testError(async () => {
      return await placesAPI.postcode(apiKey, "asdfasdf", options);
    });
    expect(error).toEqual(
      new Error(
        "Invalid Postcode: The minimum for the resource is the area and district e.g. SO16"
      )
    );

    // Requested postcode must contain a minimum of the sector plus 1 digit of the district e.g. SO1
    error = await testError(async () => {
      return await placesAPI.postcode(apiKey, "CM", options);
    });
    expect(error).toEqual(
      new Error(
        "Invalid Postcode: The minimum for the resource is the area and district e.g. SO16"
      )
    );
  });

  test("Postcode Endpoint passes with non-standard numbers of results", async () => {
    const postcode = "SO16";
    const response = await placesAPI.postcode(apiKey, postcode, { limit: 120 });
    expect(response.features.length).toEqual(120);
  });
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    let query = "10 Downing Street, London, SW1";
    const options: { offset?: number; limit?: number } = { limit: 5 };
    let response = await placesAPI.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    query = "Adanac Drive, SO16";
    response = await placesAPI.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Postcode endpoint passes with non-standard paging", async () => {
    const query = "10 Downing Street, London, SW1";
    let response = await placesAPI.find(apiKey, query, { limit: 9 });
    expect(response.features.length).toEqual(9);

    response = await placesAPI.find(apiKey, query, { offset: 2, limit: 1 });
    expect(response.features.length).toEqual(1);
  });
});
