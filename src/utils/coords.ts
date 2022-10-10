// src/utils/coords.ts

import proj4 from "proj4";

export { coords };
import { type BBox } from "../types.js";

/*

    coords.fromBNG
    coords.toBNG
    coords.swivelPoint
    coords.swivelBounds

*/

// eslint-disable-next-line @typescript-eslint/ban-types
const coords: { [key: string]: Function } = {
  fromBNG: (ea: number, no: number): { lat: number; lng: number } => {
    proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
    );

    const point = proj4("EPSG:27700", "EPSG:4326", [ea, no]);

    const lng = Number(point[0].toFixed(4));
    const lat = Number(point[1].toFixed(4));

    return { lat, lng };
  },

  toBNG: (lat: number, lng: number): { ea: number; no: number } => {
    proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
    );

    const point = proj4("EPSG:4326", "EPSG:27700", [lng, lat]);

    const ea = Number(point[0].toFixed(0));
    const no = Number(point[1].toFixed(0));

    return { ea, no };
  },

  swivelPoint: (point: [number, number]): [number, number] => {
    if (coords.isLngLat(point)) {
      return [point[1], point[0]];
    }
    return point;
  },

  swivelBounds: (bbox: BBox): BBox => {
    if (coords.isLngLat(bbox)) {
      return [bbox[1], bbox[0], bbox[3], bbox[2]];
    }
    return bbox;
  },

  isLngLat: (coords: [number, number] | BBox): boolean => coords[1] > coords[0],
};
