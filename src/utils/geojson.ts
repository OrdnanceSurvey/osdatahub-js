// src/utils/geojson.ts

import {
  NamesResponse,
  OSDataHubResponse,
  OSFeatureCollection,
  PlacesResponse,
  CoordinateGeometry,
} from "../types";
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import { coords } from "./coords";
import { logging } from "./logging";

export { geojson };

/*

    geojson.from
    geojson.into

*/

const geojson = {
  from: function (geoJson: Feature | FeatureCollection) {
    let output: Feature;
    try {
      if ("features" in geoJson && geoJson.features.length === 0) {
        throw new Error("Input was a feature collection but had no features");
      }
      if ("features" in geoJson) {
        output = geoJson.features[0];
        if (geoJson.features.length > 1) {
          logging.warn("Multiple features passed, only using the first one!");
        }
      } else {
        output = geoJson;
      }

      (output.geometry as CoordinateGeometry).coordinates = (
        output.geometry as CoordinateGeometry
      ).coordinates.map((coordinate) =>
        coords.swivelPoint(coordinate as [number, number])
      );

      return output;
    } catch {
      throw new Error(
        "Failed to read GeoJSON input. Does the GeoJSON input adhere to specification?"
      );
    }
  },

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
