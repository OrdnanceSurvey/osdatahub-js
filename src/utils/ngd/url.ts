// src/utils/ngd/url.ts
import { BBox } from "../../types";

export { buildUrl };

function buildUrl(
  collectionId: string,
  {
    featureId = null,
    bbox = null,
    datetime = null,
    filter = null,
  }: {
    featureId?: string | null;
    bbox?: null | BBox;
    datetime?: null | string;
    filter?: null | string;
  } = {}
) {
  const root = "https://api.os.uk/features/ngd/ofa/v1/collections/";
  let queryParams: { bbox?: string; datetime?: string; filter?: string } = {};
  if (bbox) {
    queryParams["bbox"] = bbox.join(",");
  }
  if (datetime) {
    queryParams["datetime"] = datetime;
  }
  if (filter) {
    queryParams["filter"] = filter;
  }
  const query = new URLSearchParams(queryParams).toString();
  const subdirs = `${collectionId}/items${featureId ? `/${featureId}?` : "?"}`;
  return root + subdirs + query;
}
