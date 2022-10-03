// src/handlers/handlePlaces.js

import { coords } from "./utils/coords.js"; // no longer required as coords.swivel moved
import { request } from "./utils/request.js";
import { geojson } from "./utils/geojson.js";
import { validateParams } from "./utils/sanitise.js";
import { buildUrl } from "./utils/url.js";

export { places };

function initialiseConfig(apiKey, paging = [0, 1000]) {
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

async function requestPlaces(config) {
  let responseObject = await request(config);
  let responseObjectGeoJSON = geojson.into(responseObject);
  return responseObjectGeoJSON;
}

const places = {
  polygon: async (apiKey, polygon, { paging = [0, 1000] } = {}) => {
    validateParams({ apiKey, polygon, paging });

    let config = initialiseConfig(apiKey, paging);

    config.url = buildUrl("places", "polygon", { srs: "WGS84" });
    config.method = "post";
    config.body = JSON.stringify(geojson.from(polygon));

    return await requestPlaces(config);
  },

  radius: async (apiKey, point, radius, { paging = [0, 1000] } = {}) => {
    validateParams({ apiKey, point, radius, paging });

    let config = initialiseConfig(apiKey, paging);

    point = coords.swivelPoint(point);
    config.url = buildUrl("places", "radius", { srs: "WGS84", point, radius });

    return await requestPlaces(config);
  },

  bbox: async (apiKey, bbox, { paging = [0, 1000] } = {}) => {
    validateParams({ apiKey, bbox });

    let config = initialiseConfig(apiKey, paging);

    bbox = coords.swivelBounds(bbox);
    config.url = buildUrl("places", "bbox", { srs: "WGS84", bbox });

    return await requestPlaces(config);
  },

  nearest: async (apiKey, point) => {
    validateParams({ apiKey, point });

    let config = initialiseConfig(apiKey);

    point = coords.swivelPoint(point);
    config.url = buildUrl("places", "nearest", { srs: "WGS84", point });

    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  uprn: async (apiKey, uprn) => {
    validateParams({ apiKey, uprn });

    let config = initialiseConfig(apiKey);

    config.url = buildUrl("places", "uprn", { output_srs: "WGS84", uprn });
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  postcode: async (apiKey, postcode, { paging = [0, 1000] } = {}) => {
    validateParams({ apiKey, postcode, paging });

    let config = initialiseConfig(apiKey, paging);

    postcode = encodeURIComponent(postcode);
    config.url = buildUrl("places", "postcode", {
      output_srs: "WGS84",
      postcode,
    });

    return await requestPlaces(config);
  },

  find: async (apiKey, query, { paging = [0, 1000] } = {}) => {
    validateParams({ apiKey, search: query, paging });

    let config = initialiseConfig(apiKey, paging);

    query = encodeURIComponent(query);
    config.url = buildUrl("places", "find", { output_srs: "WGS84", query });

    return await requestPlaces(config);
  },
};
