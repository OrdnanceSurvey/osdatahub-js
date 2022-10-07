// src/utils/geojson.ts

import {
  NamesResponse,
  OSDataHubResponse,
  OSFeatureCollection,
  PlacesResponse,
} from "../types.js";
import {
    Feature,
    Geometry,
    GeoJsonProperties,
} from "geojson";

export { geojson };

/*

    geojson.from
    geojson.into

*/

const geojson = {


  into: function (response: OSDataHubResponse): OSFeatureCollection {
    if (response.results.length == 0) {
      return {
        type: "FeatureCollection",
        features: [],
        header: response.header,
      };
    }
    return responseToFeatureCollection(response);
  },
};

function responseToFeatureCollection(
  response: OSDataHubResponse
): OSFeatureCollection {
  let features: Feature[];
  if ("DPA" in response.results[0]) {
    features = placesResponseToFeatures(response as PlacesResponse);
  } else if ("GAZETTEER_ENTRY" in response.results[0]) {
    features = namesResponseToFeatures(response as NamesResponse);
  } else {
    throw new Error("Unknown response given from OS Data Hub");
  }
  return {
    type: "FeatureCollection",
    features: features,
    header: response.header,
  };
}

function namesResponseToFeatures(response: NamesResponse): Feature[] {
  return response.results.map(
    (feature) =>
      <Feature>{
        type: "Feature",
        geometry: <Geometry>{
          type: "Point",
          coordinates: [
            feature.GAZETTEER_ENTRY.LNG,
            feature.GAZETTEER_ENTRY.LAT,
          ],
        },
        properties: <GeoJsonProperties>feature.GAZETTEER_ENTRY,
      }
  );
}

function placesResponseToFeatures(response: PlacesResponse): Feature[] {
  return response.results.map(
    (feature) =>
      <Feature>{
        type: "Feature",
        geometry: <Geometry>{
          type: "Point",
          coordinates: [feature.DPA.LNG, feature.DPA.LAT],
        },
        properties: <GeoJsonProperties>feature.DPA,
      }
  );
}
