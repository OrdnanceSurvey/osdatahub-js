// src/utils/geojson.ts

import {namesResponse, OSDataHubResponse, OSFeatureCollection, placesResponse} from "../types";
import {FeatureCollection, Feature, Geometry, GeoJsonProperties, Point, Polygon} from "geojson";

export {
    geojson
}

/*

    geojson.from
    geojson.into

*/

const geojson = {

    from: function (input: Feature | FeatureCollection | Polygon) {
        try {
            let output: Feature;
            if ((<FeatureCollection>input).features) {
                if ("features" in input) {
                    output = input.features[0]
                } else {
                    throw Error("Input was a feature collection but had no features")
                }
            } else {
                output = <Feature>input
            }
            // @ts-ignore
            for (let i = 0; i < output.geometry.coordinates.length; i++) {
                // for each polygon...
                // @ts-ignore
                for (let j = 0; j < output.geometry.coordinates[i].length; j++) {
                    // ... swap each pair of coordinates
                    // @ts-ignore
                    [output.geometry.coordinates[i][j][0], output.geometry.coordinates[i][j][1]] = [output.geometry.coordinates[i][j][1], output.geometry.coordinates[i][j][0]];
                }
            }
            return output

        } catch {
            throw new Error('Failed to read GeoJSON input. Does the GeoJSON input adhere to specification?')
        }
    },

    into: function (input: OSDataHubResponse): OSFeatureCollection {


        if (input.results.length == 0) {

            // No Features Returned
            return {type: "FeatureCollection", features: [], header: input.header}
        } else if (input as placesResponse) {
            let features: Feature[] = (input as placesResponse).results.map((feature) => <Feature>{
                type: "Feature",
                geometry: <Geometry>{
                    type: "Point",
                    coordinates: [feature.DPA.LNG, feature.DPA.LAT]
                },
                properties: <GeoJsonProperties>feature.DPA
            })

            return {type: "FeatureCollection", features: features, header: input.header}

        } else if (input as namesResponse) {
            let features: Feature[] = (input as namesResponse).results.map((feature) => <Feature>{
                type: "Feature",
                geometry: <Geometry>{
                    type: "Point",
                    coordinates: [feature.GAZETTEER_ENTRY.LNG, feature.GAZETTEER_ENTRY.LAT]
                },
                properties: <GeoJsonProperties>feature.GAZETTEER_ENTRY
            })
            return {type: "FeatureCollection", features: features, header: input.header}
        } else {
            throw Error("Unknown response given from OS Data Hub")
        }
    }



}