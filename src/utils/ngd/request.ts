// src/utils/request.ts
import { type Config, type OSDataHubResponse } from "../../types.js";
import { continuePaging, logEndConditions } from "../request.js";
import { logging } from "../logging.js";
import { NGDLink, NGDOutput } from "./types.js";
import fetch from "cross-fetch";

export { request, get };

async function get(endpoint: string, key: string = ""): Promise<Response> {
  logging.info("🔍 " + endpoint);
  return fetch(endpoint, {
    method: "get",
    headers: {
      key: key,
    },
  }).then(async (res) => {
    if (res.ok) return res;

    const body = res.text();

    if ((await body).includes("InvalidApiKey")) {
      throw new Error("Invalid API Key");
    }

    throw new Error(JSON.parse(await body).description);
  });
}

function getOffsetEndpointNGD(config: Config, featureCount: number): string {
  const limit = Math.min(
    config.paging.limitValue - config.paging.startValue - featureCount,
    100
  );
  return config.url + "&offset=" + config.paging.position + "&limit=" + limit;
}

function filterSelfLink(links: NGDLink[]): NGDLink {
  return links.filter((link) => {
    return link.rel == "self";
  })[0];
}

async function request(config: Config): Promise<NGDOutput> {
  let endpoint: string;
  let featureCount = 0;
  let output: NGDOutput | undefined = {
    type: "FeatureCollection",
    features: [],
    numberReturned: 0,
    links: [],
  };

  const getEndpoint = config.paging.enabled
    ? getOffsetEndpointNGD
    : () => config.url;

  while (continuePaging(config)) {
    endpoint = getEndpoint(config, featureCount);

    let response: Response = await get(endpoint, config.key);

    const responseJson: NGDOutput = <NGDOutput>await response.json();

    output.features = output.features.concat(responseJson.features);
    output.links = output.links.concat(filterSelfLink(responseJson.links));

    if (responseJson.features && responseJson.features.length == 100) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }

    featureCount = output.features.length;
  }

  logEndConditions(config, featureCount);

  if (typeof output === "undefined") {
    throw Error("There is no output at the end of request");
  }

  output.numberReturned = featureCount;
  return output;
}
