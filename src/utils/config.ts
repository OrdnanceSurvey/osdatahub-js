// src/utils/config.ts
import { type Config } from "../types.js";

export { initialiseConfig };

function initialiseConfig(apiKey: string, offset = 0, limit = 100): Config {
  return {
    url: "",
    key: apiKey,
    body: "",
    method: "get",
    paging: {
      enabled: true,
      position: offset,
      startValue: offset,
      limitValue: offset + limit,
      isNextPage: true,
    },
  };
}
