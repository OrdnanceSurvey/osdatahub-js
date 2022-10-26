// src/handlers/ngd.ts

import { requestNGD as request, get } from "./utils/request.js";
import { type FeatureCollection } from "geojson";
import { buildNGDUrl } from "./utils/url.js";
import { validateParams } from "./utils/validate.js";
import { Config } from "./types.js";
import { initialiseConfig } from "./utils/config.js";
import fetch from "node-fetch";

export { ngd };

async function requestNGD(config: Config): Promise<FeatureCollection> {
  return await request(config);
}

const ngd = {
  items: async (
    apiKey: string,
    collectionId: string,
    { offset = 0, limit = 1000 }: { offset?: number; limit?: number } = {}
  ): Promise<FeatureCollection> => {
    validateParams({ apiKey, collectionId, offset, limit });
    const config = initialiseConfig(apiKey, offset, limit);
    config.url = buildNGDUrl(collectionId);
    return await requestNGD(config);
  },

  collections: async (collectionId: string = "") => {
    const endpoint = `https://api.os.uk/features/ngd/ofa/v1/collections/${collectionId}`;
    return await fetch(endpoint).then((response) => response.json());
  },

  schema: async (collectionId: string) => {
    const endpoint = `https://api.os.uk/features/ngd/ofa/v1/collections/${collectionId}/schema`;
    return await fetch(endpoint).then((response) => response.json());
  },

  queryables: async (collectionId: string) => {
    const endpoint = `https://api.os.uk/features/ngd/ofa/v1/collections/${collectionId}/queryables`;
    return await fetch(endpoint).then((response) => response.json());
  },

  feature: async (apiKey: string, collectionId: string, featureId: string) => {
    const endpoint = buildNGDUrl(collectionId, { featureId });
    return await get(endpoint, apiKey).then((response) => response.json());
  },
};
