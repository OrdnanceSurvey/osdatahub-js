// src/handlers/ngd.ts

import { coords } from "./utils/coords.js";
import { request } from "./utils/request.js";
import { geojson } from "./utils/geojson.js";
import { buildNGDUrl } from "./utils/url.js";
import { validateParams } from "./utils/validate.js";
import { Config, OSFeatureCollection, NamesResponse, BBox } from "./types.js";
import { initialiseConfig } from "./utils/config.js";

export { ngd };

async function requestNGD(config: Config): Promise<OSFeatureCollection> {
  const responseObject = await request(config, "ngd");
  return geojson.into(responseObject);
}

const ngd = {
  items: async (
    apiKey: string,
    collectionId: string,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<OSFeatureCollection> => {
    validateParams({ apiKey, collectionId, offset, limit });

    const config = initialiseConfig(apiKey, offset, limit);

    config.url = buildNGDUrl(collectionId);

    return await requestNGD(config);
  },
};
