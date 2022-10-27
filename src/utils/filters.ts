// @ts-ignore
import { geojsonToWKT } from "@terraformer/wkt";
import { Geometry } from "geojson";

export {
  and,
  or,
  intersects,
  not,
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  like,
  between,
};

function isNumber(value: string | number) {
  return typeof value == "number";
}

function and(filter1: string, filter2: string): string {
  return filter1 + "%20AND%20" + filter2;
}

function or(filter1: string, filter2: string): string {
  return filter1 + "%20OR%20" + filter2;
}

function intersects(geometry: Geometry | string): string {
  let geometryString = "";
  if (typeof geometry == "string") {
    geometryString = encodeURIComponent(geometry);
  } else {
    geometryString = encodeURIComponent(geojsonToWKT(geometry));
  }
  return `INTERSECTS(geometry,%20${geometryString})`;
}

function not(value: string): string {
  return "NOT%20" + value;
}

function equals(property: string, value: string | number): string {
  if (isNumber(value)) {
    return property + "%20=%20" + value;
  }
  return property + "%20=%20" + `'${encodeURIComponent(value)}'`;
}

function lessThan(property: string, value: number): string {
  return property + "%20%3C%20" + value;
}

function lessThanOrEqual(property: string, value: number): string {
  return property + "%20%3C=%20" + value;
}

function greaterThan(property: string, value: number): string {
  return property + "%20%3E%20" + value;
}

function greaterThanOrEqual(property: string, value: number): string {
  return property + "%20%3E=%20" + value;
}

function like(property: string, value: string): string {
  return property + "%20LIKE%20" + `'${encodeURIComponent(value)}'`;
}

function between(
  property: string,
  lowerValue: string,
  higherValue: string
): string {
  return property + "%20BETWEEN%20" + `${lowerValue}%20and%20${higherValue}`;
}
