// src/utils/request.ts
import { type Config, type OSDataHubResponse } from "../../types.js";
import { continuePaging, logEndConditions } from "../request.js";
import { logging } from "../logging.js";

import fetch, { type Response } from "node-fetch"; // not required in Node17.5 (LTS) onwards

import { type FeatureCollection } from "geojson";

export { request, get };

async function get(endpoint: string, key: string): Promise<Response> {
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

async function request(config: Config): Promise<FeatureCollection> {
  let endpoint: string;
  let featureCount = 0;
  let output: FeatureCollection | undefined = {
    type: "FeatureCollection",
    features: [],
  };

  const getEndpoint = config.paging.enabled
    ? getOffsetEndpointNGD
    : () => config.url;

  while (continuePaging(config)) {
    endpoint = getEndpoint(config, featureCount);

    let response: Response = await get(endpoint, config.key);

    const responseJson: FeatureCollection = <FeatureCollection>(
      await response.json()
    );

    output.features = output.features.concat(responseJson.features);

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

  return output;
}
