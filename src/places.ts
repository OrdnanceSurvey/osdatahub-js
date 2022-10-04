// src/handlers/places.ts

import {coords} from "./utils/coords"; // no longer required as coords.swivel moved
import {request} from "./utils/request";
import {geojson} from "./utils/geojson";
import {validateParams} from "./utils/validate";
import {buildUrl} from "./utils/url";

import {Config, CoordinateGeometry, OSFeatureCollection, PlacesParams} from "./types";
import {FeatureCollection, Feature, Polygon, Geometry, Position} from "geojson";

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

function isFeature(geojson: Feature | FeatureCollection | Polygon): geojson is Feature {
    return (("type" in geojson) && (geojson.type == "Feature"))
}

function isFeatureCollection(geojson: Feature | FeatureCollection | Polygon): geojson is FeatureCollection {
    return (("type" in geojson) && (geojson.type == "FeatureCollection"))
}

function isPolygon(geom: Geometry): geom is Polygon {
    return (("type" in geom) && (geom.type == "Polygon"))
}

 function preprocessPlacesPolygon (geoJson: Feature | FeatureCollection |Polygon) {
    try {
      if ((isFeatureCollection(geoJson)) && (geoJson.features.length === 0)) {
        throw new Error("Input feature collection has 0 features");
      } else if (isFeatureCollection(geoJson) && geoJson.features.length > 1) {
        throw new Error(
          `Input feature collection has too many features. Expected 1, got ${
            (geoJson as FeatureCollection).features.length
          }`
        );
      }

      let geom: Geometry;

      if (isFeature(geoJson)) {
          geom = geoJson.geometry;
      } else if (isFeatureCollection(geoJson)) {
          geom = geoJson.features[0].geometry;
      } else {
        geom = geoJson;
      }

      if (!isPolygon(geom)) {
        throw Error("Input polygon is not a polygon.")
      } else if (geom.coordinates.length === 0) {
        throw Error("Input polygon is empty")
      }

      if (!coords.isLatLng(geom.coordinates[0][0])) {
        // switches coordinates so that all long/lat points are now lat/long
        geom.coordinates[0] = geom.coordinates[0].map((coordinate) =>
          <Position>coords.swivelPoint(coordinate as [number, number])
      );
      }


      return geom;
    } catch {
      throw new Error(
        "Failed to read GeoJSON input. Does the GeoJSON input adhere to specification?"
      );
    }
  }

const places = {
  polygon: async (apiKey: string, polygon: Feature | FeatureCollection | Polygon, { paging = [0, 1000] } : {paging?: [number, number]}= {}): Promise<OSFeatureCollection> => {

    validateParams({ apiKey, polygon, paging });

    const config = initialiseConfig(apiKey, paging);
    let params: PlacesParams = { srs: "WGS84" }

    if (config.paging.limitValue < 100) {
      params.maxresults = config.paging.limitValue
    }

    config.url = buildUrl("places", "polygon", params);
    config.method = "post";
    config.body = JSON.stringify(preprocessPlacesPolygon(polygon));

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
