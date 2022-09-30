import {describe, expect, test, beforeAll} from '@jest/globals';
import * as dotenv from 'dotenv';
import places from '../build/places';

dotenv.config();

let apiKey: string;

beforeAll(() => {
    if (typeof process.env.OS_API_KEY == "string") {
        apiKey = process.env.OS_API_KEY ;
    } else {
        throw Error("Could not get api key from environment variable OS_API_KEY. Use .env or add an environment variable" +
            "containing a valid api key to run tests")
    }
})

console.log(process.env.OS_API_KEY)

describe("OS Names Find", () => {
    test("Polygon Endpoint Passes", () => {
        const polygon = {};
        expect(places.polygon({
            apiKey: apiKey,
            polygon: polygon
        })).toBe({})
    })
    test("Polygon Endpoint Fails", () => {

    })
})


describe("OS Names Nearest", () => {
    test("Polygon Endpoint Passes", () => {
        const polygon = {};
        expect(places.polygon({
            apiKey: apiKey,
            polygon: polygon
        })).toBe({})
    })
    test("Polygon Endpoint Fails", () => {

    })
})