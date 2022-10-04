import { type BBox } from "../src/types";
import {describe, expect, test, beforeAll} from '@jest/globals';
import * as dotenv from 'dotenv';
import {places} from '../src/places'
import {OSDataHubResponse, OSFeatureCollection} from "../src/types";
import {Feature, FeatureCollection, Polygon} from "geojson";

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

const point: Feature =
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [-1.4730370044708252, 50.936113462996616],
      }
    }

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
      }

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
      }

let apiKey: string;
beforeAll(() => {
  if (typeof process.env.OS_API_KEY === "string") {
    apiKey = process.env.OS_API_KEY;
  } else {
    throw Error("OS_API_KEY not provided. Make sure you provide a valid api key either throw your environment variables" +
        "or a .env file")
  }
})

describe("Polygon Endpoint", () => {
  test("Polygon Endpoint With FeatureCollection", async () => {
    const options: { paging?: [number, number] } = { paging: [0, 100] };

    let response = await places.polygon(apiKey, <FeatureCollection>featureCollection, options);
    const requiredProperties = ["features", "header", "type"]
    requiredProperties.map((prop: string) => expect(response).toHaveProperty(prop))
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Polygon endpoint passes with Polygon object", async () => {
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await places.polygon(apiKey, <Polygon>polygon, options);
    const requiredProperties = ["features", "header", "type"]
    requiredProperties.map((prop: string) => expect(response).toHaveProperty(prop))
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  })

  test("Polygon endpoint passes with specific numbers of results", async () => {
    const requiredProperties = ["features", "header", "type"]

    let response = await places.polygon(apiKey, featureCollection, { paging: [0, 10] });
    requiredProperties.map((prop: string) => expect(response).toHaveProperty(prop))
    expect(response.features.length).toEqual(10);

    let response2 = await places.polygon(apiKey, featureCollection, { paging: [0, 2] });
    requiredProperties.map((prop: string) => expect(response2).toHaveProperty(prop))
    expect(response2.features.length).toEqual(2);
  })

  test("Polygon endpoint fails with invalid paging", async () => {
        expect(await places.polygon(apiKey, <FeatureCollection>featureCollection, {paging: [10, 0]})).toThrow();
        expect(await places.polygon(apiKey, <FeatureCollection>featureCollection, {paging: [500, 10000]})).toThrow();
  })

  test("Polygon endpoint fails with point", async () => {
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    expect(await places.polygon(apiKey, point, options)).toThrow();
  })

  test("Polygon endpoint fails with Polygon with coordinates in lat/long (not long/lat)", async () => {
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    expect(await places.polygon(apiKey, invalidPolygon, options)).toThrow();

  })
});

describe("Radius Endpoint", () => {
  test("Radius Endpoint Passes", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await places.radius(apiKey, center, 200, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    response = await places.radius(apiKey, center, 50, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Radius Endpoint passes with non-standard numbers of results", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    const radius = 200;
    let response = await places.radius(apiKey, center, radius, { paging: [0, 10] });
    expect(response.features.length).toEqual(10);

    response = await places.radius(apiKey, center, radius, { paging: [0, 1] });
    expect(response.features.length).toEqual(10);
  });

  test("Radius Endpoint fails with invalid radius", async () => {
    const center: [number, number] = [-1.4730370044708252, 50.936113462996616];
    expect(await places.radius(apiKey, center, -1, { paging: [0, 100] })).toThrow();
    expect(await places.radius(apiKey, center, 5000, { paging: [0, 100] })).toThrow();
    expect(await places.radius(apiKey, center, 0.001, { paging: [0, 100] })).toThrow();
  });

  test("Radius enpoint fails with invalid geometries", async () => {
    const radius = 200
    expect(await places.radius(apiKey, [1000, 1000], radius, { paging: [0, 100] })).toThrow();
    expect(await places.radius(apiKey, [50.936113462996616, -1.4730370044708252], radius, { paging: [0, 100] })).toThrow();
  })
});

describe("BBox Endpoint", () => {
  test("BBox Endpoint Passes", async () => {
    let bbox: BBox = [-1.475335, 50.936159, -1.466924, 50.939569];
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await places.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    bbox = [-1.917543,52.479173,-1.907287,52.485211]
    response = await places.bbox(apiKey, bbox, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("BBox endpoint passes with non-standard paging", async () => {
    let bbox: BBox = [-1.475335, 50.936159, -1.466924, 50.939569];

    let response = await places.bbox(apiKey, bbox, { paging: [0, 10] });
    expect(response.features.length).toEqual(10);

    response = await places.bbox(apiKey, bbox, { paging: [0, 1] });
    expect(response.features.length).toEqual(10);
  })

  test("BBox endpoint fails with invalid BBox", async () => {
        const options: { paging?: [number, number] } = { paging: [0, 100] };
        // BBox too large
        expect(await places.bbox(apiKey, [-3.070679,52.332822,-2.357941,52.694697], options)).toThrow()

        // West and East are switched
        expect(await places.bbox(apiKey, [-1.907287,52.479173,-1.917543,52.485211], options)).toThrow()

        // North and South are switched
        expect(await places.bbox(apiKey, [-1.917543,52.485211,-1.907287,52.479173], options)).toThrow()

        // Obviously not latitude and longitude
        expect(await places.bbox(apiKey, [-1000,0,1000,500], options)).toThrow();

        // Invalid latitude values (need to be -90 <= x <= 90)
        expect(await places.bbox(apiKey, [-1,100,1,120], options)).toThrow();
  })

});

describe("Nearest Endpoint", () => {
  test("Nearest Endpoint Passes", async () => {
    let point: [number, number] = [-1.471237, 50.938189];
    let response = await places.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);

    point = [-1.924796,52.479180];
    response = await places.nearest(apiKey, point);
    expect(response.features.length).toEqual(1);
  });

  test("Newarest endpoing fails with invalid point", async () => {
    expect(await places.nearest(apiKey, [1000, 1000])).toThrow();
    // outside uk
    expect(await places.nearest(apiKey, [-12.720966,39.099627])).toThrow();
    // lat long flipped
    expect(await places.nearest(apiKey, [50.938189, -1.471237])).toThrow();
  })
});

describe("UPRN Endpoint", () => {
  test("UPRN endpoint passes", async () => {
    const uprn = 200010019924;
    let response = await places.uprn(apiKey, uprn);
    expect(response.features.length).toEqual(1);
  });

  test("UPRN endpoint fails with invalid UPRN", async () => {
    // can't be a negative number
    expect(await places.uprn(apiKey, -1000)).toThrow();
    // can't be a decimal
    expect(await places.uprn(apiKey, 1.2345)).toThrow();
    // can't be greater than 12 characters
    expect(await places.uprn(apiKey, 1234567890123)).toThrow();
  });
});

describe("Postcode Endpoint", () => {
  test("Postcode Endpoint Passes", async () => {
    let postcode = "SO16 0AS";
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await places.postcode(apiKey, postcode, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    postcode = "KT11 3BB";
    response = await places.postcode(apiKey, postcode, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    postcode = "SO16";
    response = await places.postcode(apiKey, postcode, options);
    expect(response.features.length).toEqual(100);
  });

  test("Postcode Endpoint fails with invalid postcode", async () => {
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    expect(await places.postcode(apiKey, "asdfasdf", options)).toThrow();
    // Requested postcode must contain a minimum of the sector plus 1 digit of the district e.g. SO1
    expect(await places.postcode(apiKey, "CM", options)).toThrow();

  });

  test("Postcode endpoint fails with invalid paging", async () => {
    const postcode: string = "SO16 0AS";
    expect(await places.postcode(apiKey, postcode, {paging: [10, 0]})).toThrow();
    expect(await places.postcode(apiKey, postcode, {paging: [0, 100000]})).toThrow();
  })
});

describe("Find Endpoint", () => {
  test("Find Endpoint Passes", async () => {
    let query = "10 Downing Street, London, SW1";
    const options: { paging?: [number, number] } = { paging: [0, 100] };
    let response = await places.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    query = "Adanac Drive, SO16"
    response = await places.find(apiKey, query, options);
    expect(response.features.length).toBeGreaterThanOrEqual(1);
  });

  test("Postcode endpoint passes with non-standard paging", async () => {
    let query = "10 Downing Street, London, SW1";
    let response = await places.find(apiKey, query, {paging: [0, 10]});
    expect(response.features.length).toBeGreaterThanOrEqual(1);

    response = await places.find(apiKey, query, {paging: [0, 1]});
    expect(response.features.length).toEqual(1);
  })

  test("Postcode endpoint fails with invalid paging", async () => {
    let query = "10 Downing Street, London, SW1";
    expect(await places.find(apiKey, query, {paging: [10, 0]})).toThrow();
    expect(await places.find(apiKey, query, {paging: [0, 100000]})).toThrow();
  })
});
