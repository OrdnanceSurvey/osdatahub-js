// src/utils/ngd/url.ts
import { BBox } from "../../types";

export { buildNGDUrl };

function buildNGDUrl(
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
  let queryStrings = [];
  if (bbox) {
    queryStrings.push("bbox=" + bbox.join(","));
  }
  if (datetime) {
    queryStrings.push("datetime=" + datetime);
  }
  if (filter) {
    queryStrings.push("filter=" + filter);
  }
  const query = queryStrings.join("&");
  const subdirs = `${collectionId}/items${featureId ? `/${featureId}?` : "?"}`;
  return root + subdirs + query;
}
