import { FeatureCollection } from "geojson";

export {
  Config,
  OSDataHubResponse,
  BBox,
  OSFeatureCollection,
  PlacesResponse,
  NamesResponse,
  PlacesParams,
};

// Request Configuration

interface Config {
  url: string;
  key: string;
  body: string;
  method: Method;
  paging: Paging;
}

type Method = "post" | "get";

interface Paging {
  enabled: boolean;
  position: number;
  startValue: number;
  limitValue: number;
  isNextPage: boolean;
}

interface OSDataHubResponseHeader {
  uri: string;
  query: string;
}

interface OSDataHubResponse {
  header: OSDataHubResponseHeader;
  // eslint-disable-next-line @typescript-eslint/ban-types
  results: Array<Object>;
}

type BBox = [number, number, number, number];

interface OSFeatureCollection extends FeatureCollection {
  // eslint-disable-next-line @typescript-eslint/ban-types
  header: Object;
}

interface PlacesFeature {
  DPA: {
    LNG: number;
    LAT: number;
  };
}

interface PlacesResponse extends OSDataHubResponse {
  results: Array<PlacesFeature>;
}

interface NamesFeature {
  GAZETTEER_ENTRY: {
    LNG: number;
    LAT: number;
    GEOMETRY_X: number;
    GEOMETRY_Y: number;
  };
}

interface NamesResponse extends OSDataHubResponse {
  results: Array<NamesFeature>;
}

type PlacesParams = {
  srs?: string;
  maxresults?: string;
};
