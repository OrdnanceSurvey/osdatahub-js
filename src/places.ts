// src/handlers/places.ts

import { coords } from "./utils/coords"; // no longer required as coords.swivel moved
import { request } from "./utils/request";
import { geojson } from "./utils/geojson";
import { validateParams } from "./utils/validate";
import { buildUrl } from "./utils/url";

import {
  Config,
  CoordinateGeometry,
  OSFeatureCollection,
  PlacesParams,
} from "./types";
import {
  FeatureCollection,
  Feature,
  Polygon,
  Geometry,
  Position,
} from "geojson";

export { places };

function initialiseConfig(
  apiKey: string,
  offset: number = 0,
  limit: number = 1000
): Config {
  return {
    url: "",
    key: apiKey,
    body: "",
    method: "get",
    paging: {
      enabled: true,
      position: offset,
      startValue: offset,
      limitValue: offset + limit,
      isNextPage: true,
    },
  };
}

async function requestPlaces(config: Config): Promise<OSFeatureCollection> {
  let responseObject = await request(config);
  return geojson.into(responseObject);
}

function isFeature(
  geojson: Feature | FeatureCollection | Polygon
): geojson is Feature {
  return "type" in geojson && geojson.type == "Feature";
}

function isFeatureCollection(
  geojson: Feature | FeatureCollection | Polygon
): geojson is FeatureCollection {
  return "type" in geojson && geojson.type == "FeatureCollection";
}

function isPolygon(geom: Geometry): geom is Polygon {
  return "type" in geom && geom.type == "Polygon";
}

function preprocessPlacesPolygon(
  geoJson: Feature | FeatureCollection | Polygon
) {
  try {
    if (isFeatureCollection(geoJson) && geoJson.features.length === 0) {
      throw new Error("Input feature collection has 0 features");
    } else if (isFeatureCollection(geoJson) && geoJson.features.length > 1) {
      throw new Error(
        `Input feature collection has too many features. Expected 1, got ${
          (geoJson as FeatureCollection).features.length
        }`
      );
    }

    let geom: Geometry;

    if (isFeature(geoJson)) {
      geom = geoJson.geometry;
    } else if (isFeatureCollection(geoJson)) {
      geom = geoJson.features[0].geometry;
    } else {
      geom = geoJson;
    }

    if (!isPolygon(geom)) {
      throw Error("Input polygon is not a polygon.");
    } else if (geom.coordinates.length === 0) {
      throw Error("Input polygon is empty");
    }

    if (coords.isLngLat(geom.coordinates[0][0])) {
      geom.coordinates[0] = geom.coordinates[0].map(
        (coordinate) =>
          <Position>coords.swivelPoint(coordinate as [number, number])
      );
    }

    return geom;
  } catch {
    throw new Error(
      "Failed to read GeoJSON input. Does the GeoJSON input adhere to specification?"
    );
  }
}

const places = {
  polygon: async (
    apiKey: string,
    polygon: Feature | FeatureCollection | Polygon,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, polygon, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);
    let params: PlacesParams = { srs: "WGS84" };

    if (config.paging.limitValue < 100) {
      params.maxresults = config.paging.limitValue;
    }

    config.url = buildUrl("places", "polygon", params);
    config.method = "post";
    config.body = JSON.stringify(preprocessPlacesPolygon(polygon));

    return await requestPlaces(config);
  },

  radius: async (
    apiKey: string,
    point: [number, number],
    radius: number,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, point, radius, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    const pointSwivelled = coords
      .swivelPoint(point)
      .toString()
      .replaceAll(" ", "");
    config.url = buildUrl("places", "radius", {
      srs: "WGS84",
      point: pointSwivelled,
      radius,
    });

    return await requestPlaces(config);
  },

  bbox: async (
    apiKey: string,
    bbox: [number, number, number, number],
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, bbox, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    const bboxSwivelled = coords
      .swivelBounds(bbox)
      .toString()
      .replaceAll(" ", "");
    config.url = buildUrl("places", "bbox", {
      srs: "WGS84",
      bbox: bboxSwivelled,
    });

    return await requestPlaces(config);
  },

  nearest: async (apiKey: string, point: [number, number]) => {
    validateParams({ apiKey, point });

    const config = initialiseConfig(apiKey);

    const pointSwivelled = coords
      .swivelPoint(point)
      .toString()
      .replaceAll(" ", "");
    config.url = buildUrl("places", "nearest", {
      srs: "WGS84",
      point: pointSwivelled,
    });
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  uprn: async (apiKey: string, uprn: number) => {
    validateParams({ apiKey, uprn });

    const config = initialiseConfig(apiKey);

    config.url = buildUrl("places", "uprn", { output_srs: "WGS84", uprn });
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  postcode: async (
    apiKey: string,
    postcode: string,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, postcode, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    postcode = encodeURIComponent(postcode);
    config.url = buildUrl("places", "postcode", {
      output_srs: "WGS84",
      postcode,
    });

    return await requestPlaces(config);
  },

  find: async (
    apiKey: string,
    query: string,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, query, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    query = encodeURIComponent(query);
    config.url = buildUrl("places", "find", { output_srs: "WGS84", query });

    return await requestPlaces(config);
  },
};
