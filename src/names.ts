// src/handlers/names.ts

import { coords } from "./utils/coords";
import { request } from "./utils/request";
import { geojson } from "./utils/geojson";
import { buildUrl } from "./utils/url";
import { validateParams } from "./utils/validate";
import { Config, OSFeatureCollection, NamesResponse } from "./types";
import { initialiseConfig } from "./utils/config";

export { names };

async function requestNames(config: Config): Promise<OSFeatureCollection> {
  let coordsTemp: { lat: number; lng: number };
  let responseObject = (await request(config)) as NamesResponse;
  responseObject.results.forEach((result) => {
    coordsTemp = coords.fromBNG(
      result.GAZETTEER_ENTRY.GEOMETRY_X,
      result.GAZETTEER_ENTRY.GEOMETRY_Y
    );
    result.GAZETTEER_ENTRY.LNG = coordsTemp.lng;
    result.GAZETTEER_ENTRY.LAT = coordsTemp.lat;
  });

  return geojson.into(responseObject);
}

const names = {
  /**
   * Get the nearest name to an input coordinate.
   *
   * @param {string} apiKey - A valid Os Data Hub key
   * @param {[number, number]} point - A Lat/Lng coordinate
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
   * @param {string} apiKey - A valid Os Data Hub key
   * @param {[number, number]} query - Free text search parameter.
   * @param {Object} options - Optional arguments
   * @param {[number, number]} [options.paging] - The start and end offset parameters
   * @return {Promise<OSFeatureCollection>} - A GeoJSON Feature Collection
   */
  find: async (
    apiKey: string,
    query: string,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, query });

    const config = initialiseConfig(apiKey, paging);

    config.url = buildUrl("names", "find", { query });

    return await requestNames(config);
  },
};
