// src/utils/request.ts

import { logging } from "./logging.js";
import { type Config } from "../types.js";

import fetch from "node-fetch"; // not required in Node17.5 (LTS) onwards

export { request };

async function post(endpoint: string, key: string, body: string) {
  return await fetch(endpoint, {
    method: "post",
    headers: {
      "content-type": "application/json",
      key: key,
    },
    body: body,
  });
}

async function get(endpoint: string, key: string) {
  return await fetch(endpoint, {
    method: "get",
    headers: {
      key: key,
    },
  });
}

function getOffsetEndpoint(config: Config) {
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

async function request(config: Config) {
  let response, responseObject, responseObjectTemp, endpoint: string;

  while (
    config.paging.isNextPage &&
    config.paging.position < config.paging.limitValue
  ) {
    endpoint = config.paging.enabled ? getOffsetEndpoint(config) : config.url;
    
    response =
      config.method == "get"
        ? await get(endpoint, config.key)
        : await post(endpoint, config.key, config.body);
    logging.info("🔍 " + endpoint);

    checkStatusCode(response.status)

    responseObjectTemp = await response.json();

    if (config.paging.position == config.paging.startValue) {
      responseObject = responseObjectTemp;
    } else {
      responseObject.results = responseObject.results.concat(
        responseObjectTemp.results
      );
    }

    if (
      !responseObjectTemp.results ||
      responseObjectTemp.results.length == 100
    ) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }
  }

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

  return responseObject;
}
