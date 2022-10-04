// src/handlers/names.ts

import { coords } from "./utils/coords";
import { request } from "./utils/request";
import { geojson } from "./utils/geojson";
import { buildUrl } from "./utils/url";
import { validateParams } from "./utils/sanitise";
import { Config, FeatureCollection } from "./types";
import { initialiseConfig } from "./utils/config";

export { names };

async function requestNames(config: Config): Promise<FeatureCollection> {
  let coordsTemp: {lat: number, lng: number};
  let responseObject = await request(config);
  responseObject.results.forEach((result) => {
    coordsTemp = coords.fromBNG(
      // @ts-ignore
      result.GAZETTEER_ENTRY.GEOMETRY_X,
      // @ts-ignore
      result.GAZETTEER_ENTRY.GEOMETRY_Y
    );
    // @ts-ignore
    result.GAZETTEER_ENTRY.LNG = coordsTemp.lng;
    // @ts-ignore
    result.GAZETTEER_ENTRY.LAT = coordsTemp.lat;
  });

  return geojson.into(responseObject);
}

const names = {
  nearest: async (
    apiKey: string,
    point: [number, number]
  ): Promise<FeatureCollection> => {
    validateParams({ apiKey, point });

    const config = initialiseConfig(apiKey);

    const pointSwivelled = coords.swivelPoint(point).split(",");
    const pointBNG = coords.toBNG(
      parseFloat(pointSwivelled[0]),
      parseFloat(pointSwivelled[1])
    );
    config.url = buildUrl("names", "nearest", {
      point: `${pointBNG.ea},${pointBNG.no}`,
    });
    config.paging.enabled = false;

    return await requestNames(config);
  },

  find: async (
    apiKey: string,
    query: string,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ): Promise<FeatureCollection> => {
    validateParams({ apiKey, query });

    const config = initialiseConfig(apiKey, paging);

    config.url = buildUrl("names", "find", { query });

    return await requestNames(config);
  },
};
