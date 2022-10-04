import {
  FeatureCollection,
  Feature,
  Point,
  Polygon,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  LineString,
} from "geojson";

export {
  Config,
  Options,
  OSDataHubResponse,
  ValidationParams as validationParams,
  PlacesOptions as placesOptions,
  BBox,
  OSFeatureCollection,
  PlacesResponse,
  NamesResponse,
  CoordinateGeometry
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

// GeoJSON

interface Geometry {
  type: string;
  coordinates: Array<any>;
}

interface OSDataHubResponseHeader {
  uri: string;
  query: string;
}

interface OSDataHubResponse {
  header: OSDataHubResponseHeader;
  results: Array<Object>;
}

interface ValidationParams extends Options {
  apiKey: string;
  paging?: [number, number];
  radius?: number;
  point?: [number, number];
  polygon?: Feature | FeatureCollection;
  bbox?: [number, number, number, number];
  uprn?: number;
  postcode?: string;
  query?: string;
}

interface PlacesOptions {
  paging?: [number, number];
}

type BBox = [number, number, number, number];

interface OSFeatureCollection extends FeatureCollection {
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

type CoordinateGeometry =
  | Point
  | MultiPoint
  | LineString
  | MultiLineString
  | Polygon
  | MultiPolygon;
