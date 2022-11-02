// src/utils/url.ts

export { buildUrl };

function buildUrl(api: string, operation: string, params: {[key: string]: string}) {
  const root = "https://api.os.uk/search/";
  const query = new URLSearchParams(params);
  return root + `${api}/v1/${operation}?` + query;
}
