// src/utils/crs.ts

export { getCRS };

const validCRS = new Set([
  "epsg:27700",
  "epsg:7405",
  "wgs84",
  "epsg:4326",
  "epsg:3857",
]);

function getCRS(value: string | number): string {
  let crs = "";

  if (typeof value == "string") {
    crs = value.toLowerCase();
  }

  if (Number.isInteger(value)) {
    crs = `epsg:${value}`;
  }

  if (isValidCRS(crs)) {
    return crs;
  }

  throw Error("Unrecognised CRS");
}

function isValidCRS(crs: string) {
  return validCRS.has(crs);
}
