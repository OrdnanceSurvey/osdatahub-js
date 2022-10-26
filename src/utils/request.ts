// src/utils/request.ts

import { logging } from "./logging.js";
import { type Config, type OSDataHubResponse } from "../types.js";
// @ts-ignore
import fetch, { type Response } from "node-fetch"; // not required in Node17.5 (LTS) onwards
// @ts-ignore
import { type FeatureCollection } from "geojson";

export { request, requestNGD, get };

async function post(
  endpoint: string,
  key: string,
  body: string
): Promise<Response> {
  logging.info("🔍 " + endpoint);
  return await fetch(endpoint, {
    method: "post",
    headers: {
      "content-type": "application/json",
      key: key,
    },
    body: body,
  });
}

async function get(endpoint: string, key: string): Promise<Response> {
  logging.info("🔍 " + endpoint);
  return await fetch(endpoint, {
    method: "get",
    headers: {
      key: key,
    },
  });
}

function getOffsetEndpoint(config: Config, featureCount: number): string {
  const limit = Math.min(
    config.paging.limitValue - config.paging.startValue - featureCount,
    100
  );
  return (
    config.url + "&offset=" + config.paging.position + "&maxresults=" + limit
  );
}

function getOffsetEndpointNGD(config: Config, featureCount: number): string {
  const limit = Math.min(
    config.paging.limitValue - config.paging.startValue - featureCount,
    100
  );
  return config.url + "&offset=" + config.paging.position + "&limit=" + limit;
}

function checkStatusCode(statusCode: number): void {
  if (statusCode != 200) {
    switch (statusCode) {
      case 400:
        throw new Error(
          `HTTP 400 (Bad Request - Potential CQL/Bounding Geometry Error)`
        );
      case 401:
        throw new Error(`HTTP 401 (Unauthorized - Check Your API Key)`);
      default:
        throw new Error(`HTTP ${statusCode}`);
    }
  }
}

function logEndConditions(config: Config): void {
  if (config.paging.position == config.paging.limitValue) {
    logging.warn(
      `🔸 The hard limit (${config.paging.limitValue} features) was reached. Additional features may be available to collect.`
    );
  } else {
    logging.info(
      `🔹 All features (${
        config.paging.position - config.paging.startValue
      }) have been collected.`
    );
  }
}

async function request(config: Config): Promise<OSDataHubResponse> {
  let endpoint: string;
  let featureCount = 0;
  let output: OSDataHubResponse | undefined;

  while (
    config.paging.isNextPage &&
    config.paging.position < config.paging.limitValue
  ) {
    endpoint = config.paging.enabled
      ? getOffsetEndpoint(config, featureCount)
      : config.url;

    const response: Response =
      config.method == "get"
        ? await get(endpoint, config.key)
        : await post(endpoint, config.key, config.body);

    checkStatusCode(response.status);

    const responseJson: OSDataHubResponse = <OSDataHubResponse>(
      await response.json()
    );

    if (typeof output === "undefined") {
      if (!("results" in responseJson)) {
        output = {
          header: responseJson.header,
          results: [],
        };
      } else {
        output = responseJson;
      }
    } else {
      output.results = output.results.concat(responseJson.results);
    }

    if (responseJson.results && responseJson.results.length == 100) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }

    featureCount = output.results.length;
  }

  logEndConditions(config);
  if (typeof output === "undefined") {
    throw Error("There is no output at the end of request");
  } else {
    return output;
  }
}

async function requestNGD(config: Config): Promise<FeatureCollection> {
  let endpoint: string;
  let featureCount = 0;
  let output: FeatureCollection | undefined;

  while (
    config.paging.isNextPage &&
    config.paging.position < config.paging.limitValue
  ) {
    endpoint = config.paging.enabled
      ? getOffsetEndpointNGD(config, featureCount)
      : config.url;

    const response: Response =
      config.method == "get"
        ? await get(endpoint, config.key)
        : await post(endpoint, config.key, config.body);

    checkStatusCode(response.status);

    const responseJson: FeatureCollection = <FeatureCollection>(
      await response.json()
    );

    if (typeof output === "undefined") {
      if (!("features" in responseJson)) {
        output = {
          type: "FeatureCollection",
          features: [],
        };
      } else {
        output = responseJson;
      }
    } else {
      output.features = output.features.concat(responseJson.features);
    }

    if (responseJson.features && responseJson.features.length == 100) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }

    featureCount = output.features.length;
  }

  logEndConditions(config);
  if (typeof output === "undefined") {
    throw Error("There is no output at the end of request");
  } else {
    return output;
  }
}
