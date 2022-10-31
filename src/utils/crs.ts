// src/utils/crs.ts

export { getCRS };

const validCRS: {[key: string]: string} = {
  "epsg:27700": "http://www.opengis.net/def/crs/EPSG/0/27700",
  "epsg:7405": "http://www.opengis.net/def/crs/EPSG/0/7405",
  wgs84: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
  crs84: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
  "epsg:4326": "http://www.opengis.net/def/crs/EPSG/0/4326",
  "epsg:3857": "http://www.opengis.net/def/crs/EPSG/0/3857",
};

function getCRS(value: string | number): string {
  let crs = "";

  if (typeof value == "string") {
    crs = value.toLowerCase();
  }

  if (Number.isInteger(value)) {
    crs = `epsg:${value}`;
  }

  if (crs in validCRS) {
    return validCRS[crs];
  }

  throw Error("Unrecognised CRS");
}
