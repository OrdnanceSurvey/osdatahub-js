import {
  FeatureCollection,
  Feature,
  Polygon,
} from "geojson";

export {
  Config,
  Options,
  OSDataHubResponse,
  ValidationParams,
  BBox,
  OSFeatureCollection,
  PlacesResponse,
  NamesResponse,
  PlacesParams
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

// Optional User Input

interface Options {
  paging?: [number, number];
  filter?: string;
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

interface ValidationParams extends Options {
  apiKey: string;
  offset?: number,
  limit?: number,
  radius?: number;
  point?: [number, number];
  polygon?: Feature | FeatureCollection | Polygon;
  bbox?: [number, number, number, number];
  uprn?: number;
  postcode?: string;
  query?: string;
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


interface PlacesParams {
  srs?: string
  maxresults?: number
}