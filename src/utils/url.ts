// src/utils/url.ts

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
    params = {},
  }: { featureId?: string | null; params?: any } = {}
) {
  const root = "https://api.os.uk/features/ngd/ofa/v1/collections/";
  const query = new URLSearchParams(params);
  const subdirs = `${collectionId}/items${featureId ? `/${featureId}?` : "?"}`;
  return root + subdirs + query;
}
