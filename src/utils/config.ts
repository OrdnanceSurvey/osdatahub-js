// src/utils/config.ts
import { type Config } from "../types.js";

export { initialiseConfig };

function initialiseConfig(
  apiKey: string,
  paging: [number, number] = [0, 1000]
): Config {
  return {
    url: "",
    key: apiKey,
    body: "",
    method: "get",
    paging: {
      enabled: true,
      position: paging[0],
      startValue: paging[0],
      limitValue: paging[1],
      isNextPage: true,
    },
  };
}
