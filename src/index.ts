// src/index.ts

/*

    osfetch

    Ordnance Survey GB
    A JavaScript wrapper for the OS Names API and OS Places API.

    Contributors
    https://github.com/abiddiscombe
    https://github.com/dchirst
    https://github.com/jepooley

*/

import { names } from "./names.js";
import { places } from "./places.js"

export { names, places };

// const osfetch = {
//
//   names: function (params) {
//     return names(params);
//   },
//
//   places: function (params) {
//     return names(params);
//   },
//
//   capabilities: function () {
//     let supportedServices = [
//       "this                   osfetch.capabilities()",
//       "OS Names API           osfetch.names()",
//       "OS Places API          osfetch.places()",
//       "OS NGD Features API    osfetch.ngd()",
//     ];
//
//     console.log("Supported Capabilities:");
//
//     for (let i = 0; i < supportedServices; i++) {
//       console.log(supportedServices[i]);
//     }
//   },
// };
