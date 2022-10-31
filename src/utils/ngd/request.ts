// src/utils/request.ts
import { type Config, type OSDataHubResponse } from "../../types.js";
import { get, post, continuePaging, logEndConditions } from "../request.js";

import fetch, { type Response } from "node-fetch"; // not required in Node17.5 (LTS) onwards

import { type FeatureCollection } from "geojson";

export { request };

function getOffsetEndpointNGD(config: Config, featureCount: number): string {
  const limit = Math.min(
    config.paging.limitValue - config.paging.startValue - featureCount,
    100
  );
  return config.url + "&offset=" + config.paging.position + "&limit=" + limit;
}

function checkStatus(response: Response): void {
  if (response.status != 200) {
    response.json().then((error) => {
      // @ts-ignore
      throw new Error(error.description);
    });
  }
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

  const getData = config.method == "get" ? get : post;

  while (continuePaging(config)) {
    endpoint = getEndpoint(config, featureCount);

    let response: Response = await getData(endpoint, config.key, config.body);

    checkStatus(response);

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
