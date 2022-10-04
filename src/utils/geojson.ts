// src/utils/geojson.ts

import {
  namesResponse,
  OSDataHubResponse,
  OSFeatureCollection,
  placesResponse,
  CoordinateGeometry,
} from "../types";
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import { coords } from "./coords";

export { geojson };

/*

    geojson.from
    geojson.into

*/

const geojson = {
  from: function (geoJson: Feature | FeatureCollection) {
    try {
      if ("features" in geoJson && geoJson.features.length === 0) {
        throw new Error("Input was a feature collection but had no features");
      }
      const output: Feature =
        "features" in geoJson ? geoJson.features[0] : geoJson;

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
    } else if ("DPA" in response.results[0]) {
      return placesResponseToFeatureCollection(response as placesResponse);
    } else if ("GAZETTEER_ENTRY" in response.results[0]) {
      return namesResponseToFeatureCollection(response as namesResponse);
    } else {
      throw new Error("Unknown response given from OS Data Hub");
    }
  },
};

function namesResponseToFeatureCollection(
  response: namesResponse
): OSFeatureCollection {
  const features: Feature[] = response.results.map(
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
  return {
    type: "FeatureCollection",
    features: features,
    header: response.header,
  };
}

function placesResponseToFeatureCollection(
  response: placesResponse
): OSFeatureCollection {
  const features: Feature[] = response.results.map(
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

  return {
    type: "FeatureCollection",
    features: features,
    header: response.header,
  };
}
