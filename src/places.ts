// src/handlers/places.ts

import { coords } from "./utils/coords"; // no longer required as coords.swivel moved
import { request } from "./utils/request";
import { geojson } from "./utils/geojson";
import { validateParams } from "./utils/validate";
import { buildUrl } from "./utils/url";

import { Config, OSFeatureCollection } from "./types";
import { FeatureCollection, Feature } from "geojson";

export { places };

function initialiseConfig(
  apiKey: string,
  paging: [number, number] = [0, 1000]
): Config {
  return {
    url: "",
    key: apiKey,
    body: "",
    method: "get",
    paging: {
      enabled: true,
      position: paging[0],
      startValue: paging[0],
      limitValue: paging[1],
      isNextPage: true,
    },
  };
}

async function requestPlaces(config: Config): Promise<OSFeatureCollection> {
  let responseObject = await request(config);
  return geojson.into(responseObject);
}

const places = {
  /**
   * Get places within a polygon extent.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {FeatureCollection | Feature} polygon - A GeoJSON polygon
   * @param {Object} options - Optional arguments
   * @param {number[]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  polygon: async (
    apiKey: string,
    polygon: Feature | FeatureCollection,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, polygon, paging });

    const config = initialiseConfig(apiKey, paging);

    config.url = buildUrl("places", "polygon", { srs: "WGS84" });
    config.method = "post";
    config.body = JSON.stringify(geojson.from(polygon));

    return await requestPlaces(config);
  },

  /**
   * Get places within a radius.
   *
   * @param {string} apiKey - A valid OS Data Hub key
   * @param {number[]} point - A Lng/Lat coordinate
   * @param {number} radius - Search radius (m)
   * @param {Object} options - Optional arguments
   * @param {number[]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  radius: async (
    apiKey: string,
    point: [number, number],
    radius: number,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, point, radius, paging });

    const config = initialiseConfig(apiKey, paging);

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
   * @param {number[]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  bbox: async (
    apiKey: string,
    bbox: [number, number, number, number],
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, bbox, paging });

    const config = initialiseConfig(apiKey, paging);

    const bboxSwivelled = coords.swivelBounds(bbox);
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
   * @param {number[]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  postcode: async (
    apiKey: string,
    postcode: string,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, postcode, paging });

    const config = initialiseConfig(apiKey, paging);

    postcode = encodeURIComponent(postcode);
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
   * @param {number[]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  find: async (
    apiKey: string,
    query: string,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, query, paging });

    const config = initialiseConfig(apiKey, paging);

    query = encodeURIComponent(query);
    config.url = buildUrl("places", "find", { output_srs: "WGS84", query });

    return await requestPlaces(config);
  },
};
