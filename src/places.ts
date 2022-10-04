// src/handlers/places.ts

import {coords} from "./utils/coords"; // no longer required as coords.swivel moved
import {request} from "./utils/request";
import {geojson} from "./utils/geojson";
import {validateParams} from "./utils/validate";
import {buildUrl} from "./utils/url";

import {Config, OSFeatureCollection} from "./types";
import {FeatureCollection, Feature, Polygon} from "geojson";

export { places };

function initialiseConfig(apiKey: string, paging: [number, number] = [0, 1000]): Config {
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
  polygon: async (apiKey: string, polygon: Feature | FeatureCollection | Polygon, { paging = [0, 1000] } : {paging?: [number, number]}= {}): Promise<OSFeatureCollection> => {

    validateParams({ apiKey, polygon, paging });

    const config = initialiseConfig(apiKey, paging);

    config.url = buildUrl("places", "polygon", { srs: "WGS84" });
    config.method = "post";
    config.body = JSON.stringify(geojson.from(polygon));

    return await requestPlaces(config);
  },

  radius: async (
    apiKey: string,
    point: [number, number],
    radius: number,
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ) => {
    validateParams({ apiKey, point, radius, paging });

    const config = initialiseConfig(apiKey, paging);

    const pointSwivelled = coords.swivelPoint(point).toString().replaceAll(" ", "");
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
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ) => {
    validateParams({ apiKey, bbox, paging });

    const config = initialiseConfig(apiKey, paging);

    const bboxSwivelled = coords.swivelBounds(bbox);
    config.url = buildUrl("places", "bbox", {
      srs: "WGS84",
      bbox: bboxSwivelled,
    });

    return await requestPlaces(config);
  },

  nearest: async (apiKey: string, point: [number, number]) => {
    validateParams({ apiKey, point });

    const config = initialiseConfig(apiKey);

    const pointSwivelled = coords.swivelPoint(point).toString().replaceAll(" ", "");
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
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ) => {
    validateParams({ apiKey, postcode, paging });

    const config = initialiseConfig(apiKey, paging);

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
    { paging = [0, 1000] }: { paging?: [number, number] } = {}
  ) => {
    validateParams({ apiKey, query, paging });

    const config = initialiseConfig(apiKey, paging);

    query = encodeURIComponent(query);
    config.url = buildUrl("places", "find", { output_srs: "WGS84", query });

    return await requestPlaces(config);
  },
};
