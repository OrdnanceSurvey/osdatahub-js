import {describe, expect, test} from '@jest/globals';
import * as dotenv from 'dotenv';
import { Point } from 'proj4';
import places from '../build/places';

dotenv.config();

describe("Polygon Endpoint", () => {
    test("Polygon Endpoint Passes", () => {
        const polygon = {};
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.polygon({
            apiKey: apiKey,
            polygon: polygon
        })).toBe({})
    })
    test("Polygon Endpoint Fails", () => {

    })
})


describe("BBox Endpoint", () => {
    test("BBox Endpoint Passes", () => {
        const bbox = [-1.475335, 50.936159, -1.466924, 50.939569];
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.bbox({
            apiKey: apiKey,
            bbox: bbox
        })).toBe({})
    })
})

// returns a single feature
describe("Nearest Endpoint", () => {
    test("Nearest Endpoint Passes", () => {
        const point = [-1.471237, 50.938189];
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.nearest({
            apiKey: apiKey,
            point: point
        })).toBe({})
    })
})

// requires a non-coord 'findBy'
// returns a single feature
describe("UPRN Endpoint", () => {
    test("UPRN endpoint passes", () => {
        const uprn = 200010019924;
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.uprn({
            apiKey: apiKey,
            uprn: uprn
        }))
    })
})

// requires a non-coord 'findBy'
// can be partial postcode
describe("Postcode Endpoint", () => {
    test("Postcode Endpoint Passes", () => {
        const postcode = "SO16 0AS";
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.postcode({
            apiKey: apiKey,
            postcode: postcode
        }))
    })
})

// requires a non-coords 'findBy'
describe("Find Endpoint", () => {
    test("Find Endpoint Passes", () => {
        const searchString = "10 Downing Street, London, SW1";
        const apiKey: string = process.env.OS_API_KEY;
        expect(places.bbox({
            apiKey: apiKey,
            searchString: searchString
        })).toBe({})
    })
})