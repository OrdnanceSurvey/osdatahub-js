// src/utils/coords.js

import proj4 from "proj4";

export { coords };

/*

    coords.fromBNG
    coords.toBNG
    coords.swivel

*/

const coords = {
  fromBNG: function (ea, no) {
    proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
    );

    var point = proj4("EPSG:27700", "EPSG:4326", [ea, no]);

    var lng = Number(point[0].toFixed(4));
    var lat = Number(point[1].toFixed(4));

    return { lat: lat, lng: lng };
  },

  toBNG: function (lat, lng) {
    proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
    );

    var point = proj4("EPSG:4326", "EPSG:27700", [
      parseFloat(lng),
      parseFloat(lat),
    ]);

    var ea = Number(point[0].toFixed(0));
    var no = Number(point[1].toFixed(0));

    return { ea: ea, no: no };
  },

  swivel: function (input) {
    const even = input.filter((_, index) => index % 2 !== 0);
    const odd = input.filter((_, index) => index % 2 === 0);
    const swivelled = even
      .map((value, index) => [value, odd[index]])
      .reduce((a, b) => a.concat(b));
    let output = swivelled.toString();
    return output.replaceAll(" ", "");
  },
};
