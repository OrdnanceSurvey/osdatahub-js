// src/handlers/places.ts

import { coords } from "./utils/coords.js";
import { request } from "./utils/request.js";
import { toGeoJSON } from "./utils/geojson.js";
import { validateParams } from "./utils/validate.js";
import { buildUrl } from "./utils/url.js";
import { Config, OSFeatureCollection, PlacesParams } from "./types.js";
import { initialiseConfig } from "./utils/config.js";

import {
  FeatureCollection,
  Feature,
  Polygon,
  Geometry,
  Position,
} from "geojson";

export { places };

async function requestPlaces(config: Config): Promise<OSFeatureCollection> {
  const responseObject = await request(config);
  return toGeoJSON(responseObject);
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
  /**
   * Get places within a polygon extent.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {FeatureCollection | Feature} polygon - A GeoJSON polygon
   * @param {Object} options - Optional arguments
   * @param {number} [options.offset] - The starting value for the offset
   * @param {number} [options.limit] - The max number of features to return
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  polygon: async (
    apiKey: string,
    polygon: Feature | FeatureCollection | Polygon,
    { offset = 0, limit = 100 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, polygon, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);
    const params: PlacesParams = { srs: "WGS84" };

    if (config.paging.limitValue < 100) {
      params.maxresults = config.paging.limitValue;
    }

    config.url = buildUrl("places", "polygon", params);
    config.method = "post";
    config.body = JSON.stringify(preprocessPlacesPolygon(polygon));

    return await requestPlaces(config);
  },

  /**
   * Get places within a radius.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {number[]} point - A Lng/Lat coordinate
   * @param {number} radius - Search radius (m)
   * @param {Object} options - Optional arguments
   * @param {number} [options.offset] - The starting value for the offset
   * @param {number} [options.limit] - The max number of features to return
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  radius: async (
    apiKey: string,
    point: [number, number],
    radius: number,
    { offset = 0, limit = 100 }: { offset?: number; limit?: number } = {}
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

  /**
   * Get places within a bounding box (bbox).
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {number[]} bbox - Lng/Lat bounding box [left, bottom, right, top]
   * @param {Object} options - Optional arguments
   * @param {number} [options.offset] - The starting value for the offset
   * @param {number} [options.limit] - The max number of features to return
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  bbox: async (
    apiKey: string,
    bbox: [number, number, number, number],
    { offset = 0, limit = 100 }: { offset?: number; limit?: number } = {}
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

  /**
   * Get the nearest place to an input coordinate.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {number[]} point - A Lng/Lat coordinate
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  nearest: async (
    apiKey: string,
    point: [number, number]
  ): Promise<OSFeatureCollection> => {
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

  /**
   * Get the address for a specific UPRN.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {number} uprn - Address UPRN
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  uprn: async (apiKey: string, uprn: number): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, uprn });

    const config = initialiseConfig(apiKey);

    config.url = buildUrl("places", "uprn", { output_srs: "WGS84", uprn });
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  /**
   * Find places that match a full or partial postcode.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {string} postcode - Full or partial postcode
   * @param {Object} options - Optional arguments
   * @param {number} [options.offset] - The starting value for the offset
   * @param {number} [options.limit] - The max number of features to return
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  postcode: async (
    apiKey: string,
    postcode: string,
    { offset = 0, limit = 100 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, postcode, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    config.url = buildUrl("places", "postcode", {
      output_srs: "WGS84",
      postcode,
    });

    return await requestPlaces(config);
  },

  /**
   * Find places that match a free text search.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {string} query - Free text search parameter
   * @param {Object} options - Optional arguments
   * @param {number} [options.offset] - The starting value for the offset
   * @param {number} [options.limit] - The max number of features to return
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  find: async (
    apiKey: string,
    query: string,
    { offset = 0, limit = 100 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, query, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    config.url = buildUrl("places", "find", { output_srs: "WGS84", query });

    return await requestPlaces(config);
  },
};
