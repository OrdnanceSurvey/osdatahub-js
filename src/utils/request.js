// src/utils/request.ts

import { logging } from "./logging";

import fetch from "node-fetch"; // not required in Node17.5 (LTS) onwards

export { request };

async function post(endpoint, key, body) {
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

async function get(endpoint, key) {
  logging.info("🔍 " + endpoint);
  return await fetch(endpoint, {
    method: "get",
    headers: {
      key: key,
    },
  });
}

function getOffsetEndpoint(config) {
  return config.url + "&offset=" + config.paging.position;
}

function checkStatusCode(statusCode) {
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

function logEndConditions(config) {
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

async function request(config) {
  let response, outputJson, responseJson, endpoint;

  while (
    config.paging.isNextPage &&
    config.paging.position < config.paging.limitValue
  ) {
    endpoint = config.paging.enabled ? getOffsetEndpoint(config) : config.url;

    response =
      config.method == "get"
        ? await get(endpoint, config.key)
        : await post(endpoint, config.key, config.body);

    checkStatusCode(response.status);

    responseJson = await response.json();

    if (config.paging.position == config.paging.startValue) {
      outputJson = responseJson;
    } else {
      outputJson.results = outputJson.results.concat(responseJson.results);
    }

    if (!responseJson.results || responseJson.results.length == 100) {
      config.paging.position += 100;
    } else {
      config.paging.isNextPage = false;
    }
  }

  logEndConditions(config);

  return outputJson;
}
