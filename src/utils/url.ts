// src/utils/url.ts
import { BBox } from "../types";

export { buildUrl, buildNGDUrl };

function buildUrl(api: string, operation: string, params: any) {
  const root = "https://api.os.uk/search/";
  const query = new URLSearchParams(params);
  return root + `${api}/v1/${operation}?` + query;
}

function buildNGDUrl(
  collectionId: string,
  {
    featureId = null,
    bbox = null,
    datetime = null,
  }: {
    featureId?: string | null;
    bbox?: null | BBox;
    datetime?: null | string;
  } = {}
) {
  const root = "https://api.os.uk/features/ngd/ofa/v1/collections/";
  let query = "";
  if (bbox) {
    query += "bbox=" + bbox.join(",") + "&";
  }
  if (datetime) {
    query += "datetime=" + datetime;
  }
  const subdirs = `${collectionId}/items${featureId ? `/${featureId}?` : "?"}`;
  return root + subdirs + query;
}
