// src/utils/validate.ts

import { BBox } from "../../types.js";

export { validateParams, datetimeError };

// Types
interface ValidationParams {
  bbox?: BBox | null;
  datetime?: string | null;
}

function isISO(datetime: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(datetime)) {
    return false;
  }
  return true;
}

function datetimeError() {
  return new Error(
    `
Expected either a local date, a date-time with UTC time zone (Z) or an open or closed interval. Open ranges in time intervals at the start or end are supported using a double-dot (..) or an empty string for the start/end. Date and time expressions adhere to RFC 3339. Examples:
    - A date-time: '2021-12-12T23:20:50Z'
    - A closed interval: '2021-12-12T00:00:00Z/2021-12-18T12:31:12Z'
    - Open intervals: '2021-12-12T00:00:00Z/..' or '../2021-12-18T12:31:12Z'
    - An interval until now: '2018-02-12T00:00:00Z/..' or '2018-02-12T00:00:00Z/'
`
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
const validate: { [key: string]: Function } = {
  bbox: function (bbox: BBox) {
    if (bbox[0] > bbox[2] || bbox[1] > bbox[3]) {
      throw new Error(
        "Invalid bounding box (bbox), expected [minLng, minLat, maxLng, maxLat] or [minLat, minLng, maxLat, maxLng]"
      );
    }
    return true;
  },

  datetime: function (datetime: string) {
    if (datetime.includes("/")) {
      datetime.split("/").forEach((dt) => {
        if (!isISO(dt) && dt != ".." && dt != "") {
          throw datetimeError();
        }
      });
    } else if (!isISO(datetime)) {
      throw datetimeError();
    }
    return true;
  },
};

function validateParams(params: ValidationParams) {
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) {
      validate[key] ? validate[key](value) : null;
    }
  }
  return true;
}
