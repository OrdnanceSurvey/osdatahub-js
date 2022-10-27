import { Point, Polygon } from "./geometries";

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

function and(filter1: string, filter2: string): string {
  return filter1 + "%20AND%20" + filter2;
}

function or(filter1: string, filter2: string): string {
  return filter1 + "%20OR%20" + filter2;
}

function intersects(geometry: Point | Polygon): string {
  return `INTERSECTS(geometry,%20${geometry.toString()})`;
}

function not(value: string): string {
  return "NOT%20" + value;
}

function equals(property: string, value: string): string {
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
