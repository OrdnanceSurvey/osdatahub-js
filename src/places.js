// src/handlers/handlePlaces.js

import { coords } from "./utils/coords.js"; // no longer required as coords.swivel moved
import { request } from "./utils/request.js";
import { geojson } from "./utils/geojson.js";
import { validateParams } from "./utils/sanitise.js";

export { places };

function initialiseConfig(apiKey, paging=[0, 1000]) {
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
  polygon: async (apiKey, polygon, {paging=[0, 1000]}) => {
    validateParams({ apiKey, polygon, paging});

    let config = initialiseConfig(apiKey, paging);

    config.url = `https://api.os.uk/search/places/v1/polygon?srs=WGS84`;
    config.method = "post";
    config.body = JSON.stringify(geojson.from(polygon));

    return await requestPlaces(config);
  },

  radius: async (apiKey, center, radius, {paging=[0, 1000]}) => {
    validateParams({ apiKey, center, radius, paging});

    let config = initialiseConfig(apiKey, paging);

    center = coords.swivel(center);
    config.url = `https://api.os.uk/search/places/v1/radius?srs=WGS84&point=${center}&radius=${radius}`;

    return await requestPlaces(config);
  },

  bbox: async (apiKey, bbox, {paging=[0, 1000]}) => {
    validateParams({ apiKey, bbox});

    let config = initialiseConfig(apiKey, paging);

    bbox = coords.swivel(bbox);
    config.url = `https://api.os.uk/search/places/v1/bbox?srs=WGS84&bbox=${bbox}`;

    return await requestPlaces(config);
  },

  nearest: async (apiKey, point) => {
    validateParams({ apiKey, point });

    let config = initialiseConfig(apiKey);

    const rectifiedCoords = coords.swivel(point);
    config.url = `https://api.os.uk/search/places/v1/nearest?srs=WGS84&point=${rectifiedCoords}`;
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  uprn: async (apiKey, uprn) => {
    validateParams({ apiKey, uprn});

    let config = initialiseConfig(apiKey);

    config.url = `https://api.os.uk/search/places/v1/uprn?output_srs=WGS84&uprn=${uprn}`;
    config.paging.enabled = false;

    return await requestPlaces(config);
  },

  postcode: async (apiKey, postcode, {paging=[0, 1000]}) => {
    validateParams({ apiKey, postcode, paging });

    let config = initialiseConfig(apiKey, paging);

    postcode = encodeURIComponent(postcode);
    config.url = `https://api.os.uk/search/places/v1/postcode?output_srs=WGS84&postcode=${postcode}`;

    return await requestPlaces(config);
  },

  find: async (apiKey, search, {paging=[0, 1000]}) => {
    validateParams({ apiKey, search, paging });

    let config = initialiseConfig(apiKey, paging);

    search = encodeURIComponent(search);
    config.url = `https://api.os.uk/search/places/v1/find?output_srs=WGS84&query=${search}`;

    return await requestPlaces(config);
  },
};
