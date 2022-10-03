// src/utils/build.js

export { buildUrl };

function buildUrl(api: string, operation: string, params: any) {
  const root = "https://api.os.uk/search/";
  const query = new URLSearchParams(params);
  return root + `${api}/v1/${operation}?` + query;
}
