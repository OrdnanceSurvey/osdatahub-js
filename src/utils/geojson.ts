// src/utils/geojson.ts

import {type FeatureCollection, Feature, OSDataHubResponse} from "../types";
import {type GeoJSON} from "geojson";

export {
    geojson
}

/*

    geojson.from
    geojson.into

*/

const geojson = {

    from: function (input: FeatureCollection | Feature) {
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
            for (let i = 0; i < output.geometry.coordinates.length; i++) {
                // for each polygon...
                for (let j = 0; j < output.geometry.coordinates[i].length; j++) {
                    // ... swap each pair of coordinates
                    [output.geometry.coordinates[i][j][0], output.geometry.coordinates[i][j][1]] = [output.geometry.coordinates[i][j][1], output.geometry.coordinates[i][j][0]];
                }
            }
            return output

        } catch {
            throw new Error('Failed to read GeoJSON input. Does the GeoJSON input adhere to specification?')
        }
    },

    // into: function (input: OSDataHubResponse): FeatureCollection {
    //
    //     let output
    //
    //     if (!input.results) {
    //
    //         // No Features Returned
    //
    //         output = {
    //             "type": "FeatureCollection",
    //             "uri": input.header.uri,
    //             "query": input.header.query,
    //             "features": []
    //         }
    //
    //     } else if (input.results[0].DPA) {
    //
    //         // Places > DPA
    //         output = {
    //             "type": "FeatureCollection",
    //             "uri": input.header.uri,
    //             "query": input.header.query,
    //             "totalresults": input.header.totalresults,
    //             "dataset": input.header.dataset,
    //             "lr": input.header.lr,
    //             "epoch": input.header.epoch,
    //             "features": []
    //         }
    //
    //         for (let i = 0; i < input.results.length; i++) {
    //             output.features.push({
    //                 "type": "Feature",
    //                 "properties": {
    //                     "UPRN": input.results[i].DPA.UPRN,
    //                     "UDPRN": input.results[i].DPA.UDPRN,
    //                     "ADDRESS": input.results[i].DPA.ADDRESS,
    //                     "SUB_BUILDING_NAME": input.results[i].DPA.SUB_BUILDING_NAME,
    //                     "BUILDING_NAME": input.results[i].DPA.BUILDING_NAME,
    //                     "THOROUGHFARE_NAME": input.results[i].DPA.THOROUGHFARE_NAME,
    //                     "POST_TOWN": input.results[i].DPA.POST_TOWN,
    //                     "POSTCODE": input.results[i].DPA.POSTCODE,
    //                     "RPC": input.results[i].DPA.RPC,
    //                     "X_COORDINATE": input.results[i].DPA.X_COORDINATE,
    //                     "Y_COORDINATE": input.results[i].DPA.Y_COORDINATE,
    //                     "STATUS": input.results[i].DPA.APPROVED,
    //                     "LOGICAL_STATUS_CODE": input.results[i].DPA.LOGICAL_STATUS_CODE,
    //                     "CLASSIFICATION_CODE": input.results[i].DPA.CLASSIFICATION_CODE,
    //                     "CLASSIFICATION_CODE_DESCRIPTION": input.results[i].DPA.CLASSIFICATION_CODE_DESCRIPTION,
    //                     "LOCAL_CUSTODIAN_CODE": input.results[i].DPA.LOCAL_CUSTODIAN_CODE,
    //                     "LOCAL_CUSTODIAN_CODE_DESCRIPTION": input.results[i].DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION,
    //                     "COUNTRY_CODE": input.results[i].DPA.COUNTRY_CODE,
    //                     "COUNTRY_CODE_DESCRIPTION": input.results[i].DPA.COUNTRY_CODE_DESCRIPTION,
    //                     "POSTAL_ADDRESS_CODE": input.results[i].DPA.POSTAL_ADDRESS_CODE,
    //                     "POSTAL_ADDRESS_CODE_DESCRIPTION": input.results[i].DPA.POSTAL_ADDRESS_CODE_DESCRIPTION,
    //                     "BLPU_STATE_CODE": input.results[i].DPA.BLPU_STATE_CODE,
    //                     "BLPU_STATE_CODE_DESCRIPTION": input.results[i].DPA.BLPU_STATE_CODE_DESCRIPTION,
    //                     "TOPOGRAPHY_LAYER_TOID": input.results[i].DPA.TOPOGRAPHY_LAYER_TOID,
    //                     "PARENT_UPRN": input.results[i].DPA.PARENT_UPRN,
    //                     "LAST_UPDATE_DATE": input.results[i].DPA.LAST_UPDATE_DATE,
    //                     "ENTRY_DATE": input.results[i].DPA.ENTRY_DATE,
    //                     "BLPU_STATE_DATE": input.results[i].DPA.BLPU_STATE_DATE,
    //                     "LANGUAGE": input.results[i].DPA.LANGUAGE,
    //                     "MATCH": input.results[i].DPA.MATCH,
    //                     "MATCH_DESCRIPTION": input.results[i].DPA.MATCH_DESCRIPTION,
    //                     "DELIVERY_POINT_SUFFIX": input.results[i].DPA.DELIVERY_POINT_SUFFIX
    //                 },
    //                 "geometry": {
    //                     "type": "Point",
    //                     "coordinates": [
    //                         input.results[i].DPA.LNG,
    //                         input.results[i].DPA.LAT,
    //                     ]
    //                 }
    //             })
    //         }
    //
    //
    //     } else if (input.results[0].GAZETTEER_ENTRY) {
    //
    //         // Names > GAZETTEER_ENTRY
    //
    //         output = {
    //             "type": "FeatureCollection",
    //             "uri": input.header.uri,
    //             "query": input.header.query,
    //             "format": input.header.format,
    //             "maxresults": input.header.maxresults,
    //             "offset": input.header.offset,
    //             "totalresults": input.header.totalresults,
    //             "features": []
    //         }
    //
    //         for (let i = 0; i < input.results.length; i++) {
    //             output.features.push({
    //                 "type": "Feature",
    //                 "properties": {
    //                     "ID": input.results[i].GAZETTEER_ENTRY.ID,
    //                     "NAMES_URI": input.results[i].GAZETTEER_ENTRY.NAMES_URI,
    //                     "NAME1": input.results[i].GAZETTEER_ENTRY.NAME1,
    //                     "TYPE": input.results[i].GAZETTEER_ENTRY.TYPE,
    //                     "LOCAL_TYPE": input.results[i].GAZETTEER_ENTRY.LOCAL_TYPE,
    //                     "GEOMETRY_X": input.results[i].GAZETTEER_ENTRY.GEOMETRY_X,
    //                     "GEOMETRY_Y": input.results[i].GAZETTEER_ENTRY.GEOMETRY_Y,
    //                     "MOST_DETAIL_VIEW_RES": input.results[i].GAZETTEER_ENTRY.MOST_DETAIL_VIEW_RES,
    //                     "LEAST_DETAIL_VIEW_RES": input.results[i].GAZETTEER_ENTRY.LEAST_DETAIL_VIEW_RES,
    //                     "MBR_XMIN": input.results[i].GAZETTEER_ENTRY.MBR_XMIN,
    //                     "MBR_YMIN": input.results[i].GAZETTEER_ENTRY.MBR_YMIN,
    //                     "MBR_XMAX": input.results[i].GAZETTEER_ENTRY.MBR_XMAX,
    //                     "MBR_YMAX": input.results[i].GAZETTEER_ENTRY.MBR_YMAX,
    //                     "POSTCODE_DISTRICT": input.results[i].GAZETTEER_ENTRY.POSTCODE_DISTRICT,
    //                     "POSTCODE_DISTRICT_URI": input.results[i].GAZETTEER_ENTRY.POSTCODE_DISTRICT_URI,
    //                     "POPULATED_PLACE": input.results[i].GAZETTEER_ENTRY.POPULATED_PLACE,
    //                     "POPULATED_PLACE_URI": input.results[i].GAZETTEER_ENTRY.POPULATED_PLACE_URI,
    //                     "POPULATED_PLACE_TYPE": input.results[i].GAZETTEER_ENTRY.POPULATED_PLACE_TYPE,
    //                     "DISTRICT_BOROUGH": input.results[i].GAZETTEER_ENTRY.DISTRICT_BOROUGH,
    //                     "DISTRICT_BOROUGH_URI": input.results[i].GAZETTEER_ENTRY.DISTRICT_BOROUGH_URI,
    //                     "DISTRICT_BOROUGH_TYPE": input.results[i].GAZETTEER_ENTRY.DISTRICT_BOROUGH_TYPE,
    //                     "COUNTY_UNITARY": input.results[i].GAZETTEER_ENTRY.COUNTY_UNITARY,
    //                     "COUNTY_UNITARY_URI": input.results[i].GAZETTEER_ENTRY.COUNTRY_URI,
    //                     "COUNTY_UNITARY_TYPE": input.results[i].GAZETTEER_ENTRY.COUNTY_UNITARY_TYPE,
    //                     "REGION": input.results[i].GAZETTEER_ENTRY.REGION,
    //                     "REGION_URI": input.results[i].GAZETTEER_ENTRY.REGION_URI,
    //                     "COUNTRY": input.results[i].GAZETTEER_ENTRY.COUNTRY,
    //                     "COUNTRY_URI": input.results[i].GAZETTEER_ENTRY.COUNTRY_URI,
    //                     "RELATED_SPATIAL_OBJECT": input.results[i].GAZETTEER_ENTRY.RELATED_SPATIAL_OBJECT
    //                 },
    //                 "geometry": {
    //                     "type": "Point",
    //                     "coordinates": [
    //                         input.results[i].GAZETTEER_ENTRY.LNG,
    //                         input.results[i].GAZETTEER_ENTRY.LAT,
    //                     ]
    //                 }
    //             })
    //         }
    //
    //     }
    //
    //     return output
    // }

}