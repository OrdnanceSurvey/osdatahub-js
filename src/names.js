// src/handlers/handleNames.js

import { coords } from "./utils/coords";
import { request } from "./utils/request";
import { geojson } from "./utils/geojson";
import { buildUrl } from "./utils/url";
import { validateParams } from "./utils/sanitise";

export { names };

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

async function requestNames(config) {
  let coordsTemp;
  let responseObject = await request(config);
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
  nearest: async (apiKey, point) => {
    validateParams({ apiKey, point });

    let config = initialiseConfig(apiKey);

    point = coords.swivelPoint(point).split(",");
    const pointBNG = coords.toBNG(point[0], point[1]);
    config.url = buildUrl("names", "nearest", {
      point: `${pointBNG[0]},${pointBNG[1]}`,
    });
    config.paging.enabled = false;

    return await requestNames(config);
  },
};

// switch (params.findBy[0]) {

//     case 'nearest':
//         let bngParts = coords.swivel(params.findBy[1]).split(',')
//         let convertedGeom = coords.toBNG(bngParts[0], bngParts[1])
//         config.url = `https://api.os.uk/search/names/v1/nearest?point=${convertedGeom.ea},${convertedGeom.no}`
//         config.paging.enabled = false
//         break

//     case 'find':
//         config.url = `https://api.os.uk/search/names/v1/find?query=${params.findBy[1]}`
//         break

//     default:
//         throw new Error('Invalid request type supplied. Aborting.')

// }
