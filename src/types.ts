export {
    Config,
    Options,
    FeatureCollection,
    Feature,
    OSDataHubResponse,
    validationParams,
    placesOptions
}

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
// todo: Potentially switch to GeoJSON types

interface FeatureCollection {
    type: string;
    features: Array<Feature>
}

interface Feature {
    type: string;
    properties?: any;
    geometry: Geometry
}

interface Geometry {
    type: string;
    coordinates: Array<any>
}

interface OSDataHubResponseHeader {
    uri: string,
    query: string
}

interface OSDataHubResponse {
    header: OSDataHubResponseHeader
    results: Array<Object>
}

interface validationParams extends Options {
    apiKey: string
    paging?: [number, number]
    radius?: number
    point?: [number, number]
    polygon?: Feature | FeatureCollection
    bbox?: [number, number, number, number]
    uprn?: number
    postcode?: string
    query?: string
}

interface placesOptions {
    paging?: [number, number],
}


