// src/utils/validate.ts

import {type ValidationParams} from '../types.js'
import { Feature, FeatureCollection, Polygon, Geometry } from "geojson";

export { validateParams };

// todo: convert to set, or catch at request stage

const ngdValidFeatureTypes = [
  "bld-fts-buildingline",
  "bld-fts-buildingpart",
  "gnm-fts-namedpoint",
  "lnd-fts-land",
  "lnd-fts-landform",
  "lnd-fts-landformline",
  "lnd-fts-landformpoint",
  "lnd-fts-landpoint",
  "lus-fts-site",
  "lus-fts-siteaccesslocation",
  "lus-fts-siteroutingpoint",
  "str-fts-compoundstructure",
  "str-fts-structure",
  "str-fts-structureline",
  "str-fts-structurepoint",
  "trn-fts-cartographicraildetail",
  "trn-fts-rail",
  "trn-fts-roadline",
  "trn-fts-roadtrackorpath",
  "trn-ntwk-connectinglink",
  "trn-ntwk-connectingnode",
  "trn-ntwk-ferrylink",
  "trn-ntwk-ferrynode",
  "trn-ntwk-ferryterminal",
  "trn-ntwk-path",
  "trn-ntwk-pathlink",
  "trn-ntwk-pathnode",
  "trn-ntwk-road",
  "trn-ntwk-roadjunction",
  "trn-ntwk-roadlink",
  "trn-ntwk-roadnode",
  "trn-ntwk-street",
  "trn-rami-highwaydedication",
  "trn-rami-maintenancearea",
  "trn-rami-maintenanceline",
  "trn-rami-maintenancepoint",
  "trn-rami-reinstatementarea",
  "trn-rami-reinstatementline",
  "trn-rami-reinstatementpoint",
  "trn-rami-restriction",
  "trn-rami-routinghazard",
  "trn-rami-routingstructure",
  "trn-rami-specialdesignationarea",
  "trn-rami-specialdesignationline",
  "trn-rami-specialdesignationpoint",
  "wtr-fts-intertidalline",
  "wtr-fts-tidalboundary",
  "wtr-fts-water",
  "wtr-fts-waterpoint",
  "wtr-ntwk-waterlink",
  "wtr-ntwk-waterlinkset",
  "wtr-ntwk-waternode",
];

function isFeature(
  geojson: Feature | FeatureCollection | Polygon
): geojson is Feature {
  return "type" in geojson && geojson.type == "Feature";
}

function isFeatureCollection(
  geojson: Feature | FeatureCollection | Polygon
): geojson is FeatureCollection {
  return "type" in geojson && geojson.type == "FeatureCollection";
}

function isPolygon(geom: Geometry): geom is Polygon {
  return "type" in geom && geom.type == "Polygon";
}

// eslint-disable-next-line @typescript-eslint/ban-types
const validate: { [key: string]: Function } = {
  apiKey: function (apiKey: string) {
    if (!apiKey) {
      throw new Error("No API key supplied. Aborting.");
    }
    return true;
  },
  radius: function (radius: number) {
    if (radius < 1 || radius > 1000) {
      throw new RangeError("Radius must be an integer between 1-1000m");
    }
    return true;
  },
  point: function (point: [number, number]) {
    if (point[0] > point[1]) {
      // [Lat Lng]
      if (
        point[0] < 49.781264 ||
        point[1] < -7.910156 ||
        point[0] > 59.164668 ||
        point[1] > 2.043457
      ) {
        throw new Error(
          "Invalid Point, not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
        );
      }
    } else {
      if (
        point[1] < 49.781264 ||
        point[0] < -7.910156 ||
        point[1] > 59.164668 ||
        point[0] > 2.043457
      ) {
        throw new Error(
          "Invalid Point, not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
        );
      }
    }
    return true;
  },
  polygon: function (polygon: Feature | FeatureCollection | Polygon) {
    if (isFeature(polygon) && !isPolygon(polygon.geometry)) {
      throw new Error(`Expected Polygon, got ${polygon.geometry.type}`);
    }
    if (
      isFeatureCollection(polygon) &&
      !isPolygon(polygon.features[0].geometry)
    ) {
      throw new Error(
        `Expected Polygon, got ${polygon.features[0].geometry.type}`
      );
    }
  },
  bbox: function (bbox: [number, number, number, number]) {
    if (bbox[0] > bbox[2] || bbox[1] > bbox[3]) {
      throw new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      );
    }

    if (bbox[0] > bbox[1]) {
      // [Lat Lng]
      if (
        bbox[0] < 49.781264 ||
        bbox[1] < -7.910156 ||
        bbox[2] > 59.164668 ||
        bbox[3] > 2.043457
      ) {
        throw new Error(
          "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
        );
      }
    } else {
      if (
        bbox[1] < 49.781264 ||
        bbox[0] < -7.910156 ||
        bbox[3] > 59.164668 ||
        bbox[2] > 2.043457
      ) {
        throw new Error(
          "Invalid bounding box (bbox), not within the UK (Lng, Lat): [-7.910156, 49.781264, 2.043457, 59.164668]"
        );
      }
    }

    return true;
  },
  postcode: function (postcode: string) {
    const query = /^[A-Z]{1,2}[0-9][A-Z0-9]?( ?[0-9][A-Z]{2})?$/g;
    if (!query.test(postcode)) {
      throw new Error(
        "Invalid Postcode: The minimum for the resource is the area and district e.g. SO16"
      );
    }
  },
  uprn: function (uprn: number) {
    if (!Number.isInteger(uprn) || uprn < 0 || uprn.toString().length > 12) {
      throw new Error(
        "Invalid UPRN, should be a positive integer (max. 12 digits)"
      );
    }
  },
  ngd: function (ngdFeatureType: string) {
    if (!ngdValidFeatureTypes.includes(ngdFeatureType)) {
      throw new Error(
        `Unrecognised NGD FeatureType '${ngdFeatureType}'. Aborting.`
      );
    }
  },
};

function validateParams(params: ValidationParams) {
  for (const [key, value] of Object.entries(params)) {
    validate[key] ? validate[key](value) : null;
  }
}
