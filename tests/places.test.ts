import {describe, expect, test} from '@jest/globals';
import * as dotenv from 'dotenv';
import {places} from '../build/places'

dotenv.config();

const sampleGeoJson = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -1.4730370044708252,
                            50.936113462996616
                        ],
                        [
                            -1.4670073986053467,
                            50.936113462996616
                        ],
                        [
                            -1.4670073986053467,
                            50.93952096686167
                        ],
                        [
                            -1.4730370044708252,
                            50.93952096686167
                        ],
                        [
                            -1.4730370044708252,
                            50.936113462996616
                        ]
                    ]
                ]
            }
        }
    ]
}

describe("Polygon Endpoint", () => {
    test("Polygon Endpoint Passes", async () => {
        let response = await places.polygon({
            apiKey: process.env.OS_API_KEY,
            polygon: sampleGeoJson
        })
        expect(response.features.length).toBeGreaterThanOrEqual(1)
    })
    // test("Polygon Endpoint Fails", () => {

    // })
})

// describe("BBox Endpoint", () => {
//     test("BBox Endpoint Passes", () => {
//         const bbox = [-1.475335, 50.936159, -1.466924, 50.939569];
//         const apiKey: string = process.env.OS_API_KEY;
//         expect(places.bbox({
//             apiKey: apiKey,
//             bbox: bbox
//         })).toBe({})
//     })
// })

// // returns a single feature
// describe("Nearest Endpoint", () => {
//     test("Nearest Endpoint Passes", () => {
//         const point = [-1.471237, 50.938189];
//         const apiKey: string = process.env.OS_API_KEY;
//         expect(places.nearest({
//             apiKey: apiKey,
//             point: point
//         })).toBe({})
//     })
// })

// // requires a non-coord 'findBy'
// // returns a single feature
// describe("UPRN Endpoint", () => {
//     test("UPRN endpoint passes", () => {
//         const uprn = 200010019924;
//         const apiKey: string = process.env.OS_API_KEY;
//         expect(places.uprn({
//             apiKey: apiKey,
//             uprn: uprn
//         }))
//     })
// })

// // requires a non-coord 'findBy'
// // can be partial postcode
// describe("Postcode Endpoint", () => {
//     test("Postcode Endpoint Passes", () => {
//         const postcode = "SO16 0AS";
//         const apiKey: string = process.env.OS_API_KEY;
//         expect(places.postcode({
//             apiKey: apiKey,
//             postcode: postcode
//         }))
//     })
// })

// // requires a non-coords 'findBy'
// describe("Find Endpoint", () => {
//     test("Find Endpoint Passes", () => {
//         const searchString = "10 Downing Street, London, SW1";
//         const apiKey: string = process.env.OS_API_KEY;
//         expect(places.bbox({
//             apiKey: apiKey,
//             searchString: searchString
//         })).toBe({})
//     })
// })
