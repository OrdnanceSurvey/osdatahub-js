// src/index.ts

/*

    osdatahub (JavaScript)

    Ordnance Survey GB
    A JavaScript wrapper for the OS Names API and OS Places API.

    Contributors
    https://github.com/abiddiscombe
    https://github.com/dchirst
    https://github.com/jepooley
    https://github.com/fhunt-os
    https://github.com/BenDickens

*/

import { names as namesAPI } from "./names.js";
import { places as placesAPI } from "./places.js";
import { ngd } from "./ngd.js";
import "isomorphic-fetch";

export { namesAPI, placesAPI, ngd };
