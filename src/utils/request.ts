// src/utils/request.ts

import { logging } from "./logging";
import {type Config, type OSDataHubResponse} from "../types";
import fetch, {type Response} from "node-fetch"; // not required in Node17.5 (LTS) onwards

export { request };

async function post(endpoint: string, key: string, body: string): Promise<Response> {
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

function getOffsetEndpoint(config: Config): string {
  return config.url + "&offset=" + config.paging.position;
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

async function request(config: Config): Promise<OSDataHubResponse>{
  let endpoint: string;
  let output: OSDataHubResponse;


  while (
    config.paging.isNextPage &&
    config.paging.position < config.paging.limitValue
  ) {
    endpoint = config.paging.enabled ? getOffsetEndpoint(config) : config.url;

    let response: Response =
      config.method == "get"
        ? await get(endpoint, config.key)
        : await post(endpoint, config.key, config.body);

    checkStatusCode(response.status);
    // @ts-ignore
    let responseJson: OSDataHubResponse = response.json()

    // @ts-ignore
    if (!output) {
      output = responseJson;
    } else {
      output.results = output.results.concat(responseJson.results);
    }


    if ((!responseJson.results) || responseJson.results.length == 100) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }
  }

  logEndConditions(config);
  // @ts-ignore
  if (!output) {
    throw Error("There is no output at the end of request")
  } else {
    return output;
  }
}
