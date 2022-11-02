import { type FeatureCollection } from "geojson";

export {
  NGDLink,
  NGDOutput,
  NGDCollection,
  NGDCollections,
  NGDQueryables,
  NGDSchema,
};

interface NGDExtent {
  spatial: {
    bbox: number[][];
    crs: string;
  };
  temporal: {
    interval: string[][];
    trs: string;
  };
}

interface NGDLink {
  href: string;
  rel: string;
  type: string;
  title: string;
}

interface NGDCollection {
  id: string;
  title: string;
  description: string;
  crs: string[];
  storageCrs: string;
  itemType: string;
  extent: NGDExtent;
  links: NGDLink[];
}

interface NGDCollections {
  links: NGDLink[];
  collections: NGDCollection[];
}

interface NGDQueryables {
  $schema: string;
  $id: string;
  type: string;
  title: string;
  description: string;
  properties: {[key: string]: unknown};
}

interface NGDSchema {
  $schema: string;
  $id: string;
  type: string;
  title: string;
  description: string;
  extent: NGDExtent;
  properties: {[key: string]: unknown};
}

interface NGDOutput extends FeatureCollection {
  links: NGDLink[];
  numberReturned: number;
}
