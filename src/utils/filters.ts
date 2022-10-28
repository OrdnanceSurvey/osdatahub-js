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
  isin,
  aEquals,
  aContains,
  aContainedBy,
  aOverlaps,
};

function isNumber(value: string | number) {
  return typeof value == "number";
}

/**
 * Joins two CQL filters with an AND
 *
 * @param {string} filter1 - A CQL filter
 * @param {string} filter2 - A CQL filter
 * @return {string} - Combined CQL filter string
 */
function and(filter1: string, filter2: string): string {
  return filter1 + "%20AND%20" + filter2;
}

/**
 * Joins two CQL filters with an OR
 *
 * @param {string} filter1 - A CQL filter
 * @param {string} filter2 - A CQL filter
 * @return {string} - Combined CQL filter string
 */
function or(filter1: string, filter2: string): string {
  return filter1 + "%20OR%20" + filter2;
}

/**
 * Creates geospatial intersects filter
 *
 * @param {Geometry | string} geometry - WKT or GeoJSON Geometry in WGS84 (not feature or feature collection)
 * @return {string} - CQL filter string
 */
function intersects(geometry: Geometry | string): string {
  let geometryString = "";
  if (typeof geometry == "string") {
    geometryString = encodeURIComponent(geometry);
  } else {
    geometryString = encodeURIComponent(geojsonToWKT(geometry));
  }
  return `INTERSECTS(geometry,%20${geometryString})`;
}

/**
 * Inverts filter condition - to be used together with  a logical filter e.g. equals("description", not("Building"))
 *
 * @param {string} value - Possible property value
 * @return {string} - CQL filter string
 */
function not(value: string): string {
  return "NOT%20" + `'${encodeURIComponent(value)}'`;
}

/**
 * Filters for properties with specific value
 *
 * @param {string} property - Property name
 * @param {string} value - Property value
 * @return {string} - CQL filter string
 */
function equals(property: string, value: string | number): string {
  if (isNumber(value)) {
    return property + "%20=%20" + value;
  }
  return property + "%20=%20" + `'${encodeURIComponent(value)}'`;
}

/**
 * Filters for properties less than specific value
 *
 * @param {string} property - Property name
 * @param {number} value - Property value
 * @return {string} - CQL filter string
 */
function lessThan(property: string, value: number): string {
  return property + "%20%3C%20" + value;
}

/**
 * Filters for properties less than or equal to specific value
 *
 * @param {string} property - Property name
 * @param {number} value - Property value
 * @return {string} - CQL filter string
 */
function lessThanOrEqual(property: string, value: number): string {
  return property + "%20%3C=%20" + value;
}

/**
 * Filters for properties greater than specific value
 *
 * @param {string} property - Property name
 * @param {number} value - Property value
 * @return {string} - CQL filter string
 */
function greaterThan(property: string, value: number): string {
  return property + "%20%3E%20" + value;
}

/**
 * Filters for properties greater than or equal to specific value
 *
 * @param {string} property - Property name
 * @param {number} value - Property value
 * @return {string} - CQL filter string
 */
function greaterThanOrEqual(property: string, value: number): string {
  return property + "%20%3E=%20" + value;
}

/**
 * Filters for properties whose string matches specific value
 *
 * @param {string} property - Property name
 * @param {string} value - Property value
 * @return {string} - CQL filter string
 */
function like(property: string, value: string): string {
  return property + "%20LIKE%20" + `'${encodeURIComponent(value)}'`;
}

/**
 * Filters for properties between two specific values
 *
 * @param {string} property - Property name
 * @param {number} lowerValue - Property value (lower bound)
 * @param {number} higherValue - Property value (upper bound)
 * @return {string} - CQL filter string
 */
function between(
  property: string,
  lowerValue: number,
  higherValue: number
): string {
  return property + "%20BETWEEN%20" + `${lowerValue}%20and%20${higherValue}`;
}

/**
 * Filters for properties whose value is within an approved set of values
 *
 * @param {string} property - Property name
 * @param {string[]} values - Approved property values
 * @return {string} - CQL filter string
 */
function isin(property: string, values: string[]): string {
  const valueStrings = values.map((value) => `'${encodeURIComponent(value)}'`);
  return property + "%20IN%20" + `%28${valueStrings.join("%2C")}%29`;
}

/**
 * Filters for array properties whose sets are identical
 *
 * @param {string} property - Property name
 * @param {string[]} values - Array values
 * @return {string} - CQL filter string
 */
function aEquals(property: string, values: string[]): string {
  const valueStrings = values.map((value) => `'${encodeURIComponent(value)}'`);
  return property + "%20AEQUALS%20" + `%5B${valueStrings.join("%2C")}%5D`;
}

/**
 * Filters for array properties who are a superset of input values
 *
 * @param {string} property - Property name
 * @param {string[]} values - Array values
 * @return {string} - CQL filter string
 */
function aContains(property: string, values: string[]): string {
  const valueStrings = values.map((value) => `'${encodeURIComponent(value)}'`);
  return property + "%20ACONTAINS%20" + `%5B${valueStrings.join("%2C")}%5D`;
}

/**
 * Filters for array properties who are a subset of input values
 *
 * @param {string} property - Property name
 * @param {string[]} values - Array values
 * @return {string} - CQL filter string
 */
function aContainedBy(property: string, values: string[]): string {
  const valueStrings = values.map((value) => `'${encodeURIComponent(value)}'`);
  return (
    property + "%20CONTAINED%20BY%20" + `%5B${valueStrings.join("%2C")}%5D`
  );
}

/**
 * Filters for array properties who share at least one value
 *
 * @param {string} property - Property name
 * @param {string[]} values - Array values
 * @return {string} - CQL filter string
 */
function aOverlaps(property: string, values: string[]): string {
  const valueStrings = values.map((value) => `'${encodeURIComponent(value)}'`);
  return property + "%20AOVERLAPS%20" + `%5B${valueStrings.join("%2C")}%5D`;
}
