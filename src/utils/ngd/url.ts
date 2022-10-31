// src/utils/ngd/url.ts
import { BBox } from "../../types";
import { getCRS } from "../crs";

export { buildUrl };

function buildUrl(
  collectionId: string,
  {
    featureId = null,
    bbox = null,
    datetime = null,
    filter = null,
    crs = null,
    bboxCRS = null,
    filterCRS = null,
  }: {
    featureId?: string | null;
    bbox?: null | BBox;
    datetime?: null | string;
    filter?: null | string;
    crs?: null | number | string;
    bboxCRS?: null | number | string;
    filterCRS?: null | number | string;
  } = {}
) {
  const root = "https://api.os.uk/features/ngd/ofa/v1/collections/";
  let queryParams: {
    bbox?: string;
    datetime?: string;
    filter?: string;
    crs?: string;
    "bbox-crs"?: string;
    "filter-crs"?: string;
  } = {};
  if (bbox) {
    queryParams["bbox"] = bbox.join(",");
  }
  if (datetime) {
    queryParams["datetime"] = datetime;
  }
  if (filter) {
    queryParams["filter"] = filter;
  }
  if (crs) {
    queryParams["crs"] = getCRS(crs);
  }
  if (bboxCRS) {
    queryParams["bbox-crs"] = getCRS(bboxCRS);
  }
  if (filterCRS) {
    queryParams["filter-crs"] = getCRS(filterCRS);
  }
  const query = new URLSearchParams(queryParams).toString();
  const subdirs = `${collectionId}/items${featureId ? `/${featureId}?` : "?"}`;
  return root + subdirs + query;
}
