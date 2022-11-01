// src/handlers/names.ts

import { coords } from "./utils/coords.js";
import { request } from "./utils/request.js";
import { toGeoJSON } from "./utils/geojson.js";
import { buildUrl } from "./utils/url.js";
import { validateParams } from "./utils/validate.js";
import { Config, OSFeatureCollection, NamesResponse } from "./types.js";
import { initialiseConfig } from "./utils/config.js";

export { names };

async function requestNames(config: Config): Promise<OSFeatureCollection> {
  let coordsTemp: { lat: number; lng: number };
  const responseObject = (await request(config)) as NamesResponse;
  responseObject.results.forEach((result) => {
    coordsTemp = coords.fromBNG(
      result.GAZETTEER_ENTRY.GEOMETRY_X,
      result.GAZETTEER_ENTRY.GEOMETRY_Y
    );
    result.GAZETTEER_ENTRY.LNG = coordsTemp.lng;
    result.GAZETTEER_ENTRY.LAT = coordsTemp.lat;
  });

  return toGeoJSON(responseObject);
}

const names = {
  /**
   * Get the nearest name to an input coordinate.
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

    const pointSwivelled = coords.swivelPoint(point);
    const pointBNG = coords.toBNG(pointSwivelled[0], pointSwivelled[1]);
    config.url = buildUrl("names", "nearest", {
      point: `${pointBNG.ea},${pointBNG.no}`,
    });
    config.paging.enabled = false;

    return await requestNames(config);
  },

  /**
   * Find names that match a free text search.
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

    config.url = buildUrl("names", "find", { query });

    return await requestNames(config);
  },
};
