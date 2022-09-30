// src/index.ts

/*

    osfetch

    Ordnance Survey GB
    A JavaScript wrapper for the OS Names API, OS Places API, and the OS NGD Features API.

    Contributors
    https://github.com/abiddiscombe

*/

import { handleNGD } from "./ngd.js";
import { handleNames } from "./names.js";
import { handlePlaces } from "./places.js";

export { osfetch };

const osfetch = {
  ngd: function (params) {
    return handleNGD(params);
  },

  names: function (params) {
    return handleNames(params);
  },

  places: function (params) {
    return handlePlaces(params);
  },

  capabilities: function () {
    let supportedServices = [
      "this                   osfetch.capabilities()",
      "OS Names API           osfetch.names()",
      "OS Places API          osfetch.places()",
      "OS NGD Features API    osfetch.ngd()",
    ];

    console.log("Supported Capabilities:");

    for (let i = 0; i < supportedServices; i++) {
      console.log(supportedServices[i]);
    }
  },
};
