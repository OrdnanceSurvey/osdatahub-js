// src/handlers/handleNames.ts

import { coords } from './utils/coords.js'
import { request } from './utils/request.js'
import { geojson } from './utils/geojson.js'
import {URLSearchParams} from "url";
import fetch from "node-fetch"; // not required in Node17.5 (LTS) onwards


export {
    handleNames
}

async function handleNames(params) {

    let config = {
        url: '',
        key: params.apiKey,
        body: '',
        method: 'get',
        paging: {
            enabled: true,
            position: params.paging[0],
            startValue: params.paging[0],
            limitValue: params.paging[1],
            isNextPage: true
        }
    }

    switch (params.findBy[0]) {

        case 'nearest':
            let bngParts = coords.swivel(params.findBy[1]).split(',')
            let convertedGeom = coords.toBNG(bngParts[0], bngParts[1])
            config.url = `https://api.os.uk/search/names/v1/nearest?point=${convertedGeom.ea},${convertedGeom.no}`
            config.paging.enabled = false
            break
        
        case 'find':
            config.url = `https://api.os.uk/search/names/v1/find?query=${params.findBy[1]}`
            break

        default:
            throw new Error('Invalid request type supplied. Aborting.')

    }
    
    let responseObject = await request(config)

    let coordsTemp
    for (let i = 0; i < responseObject.results.length; i++) {
        coordsTemp = coords.fromBNG(responseObject.results[i].GAZETTEER_ENTRY.GEOMETRY_X, responseObject.results[i].GAZETTEER_ENTRY.GEOMETRY_Y)
        responseObject.results[i].GAZETTEER_ENTRY.LNG = coordsTemp.lng
        responseObject.results[i].GAZETTEER_ENTRY.LAT = coordsTemp.lat
    }

    let responseObjectGeoJSON = geojson.into(responseObject)

    return responseObjectGeoJSON

}




enum API {
    NAMES = "names",
    PLACES = "places",
}

enum LocalType {
    Airfield= "Airfield",
    Airport= "Airport",
    Bay="Bay"
}

function requestOSDataHub(api: API, operation: string, params: any) {
    let url = `https://api.os.uk/search/${api}/v1/${operation}?` + new URLSearchParams(params)

    return fetch(url)
}

function validateBounds(bounds: string): boolean {
    return true
}


function buildFq(bboxFilter?: string, localType?: LocalType|LocalType[]): string[] {
    let fq: string[] = [];
    if (!(bboxFilter || localType)) {
        return
    }
    if (bboxFilter) {
        fq.push("BBOX:" + bboxFilter)
    }

    if (localType) {
        if (typeof localType === LocalType) {
            fq += "LOCAL_TYPE:" + localType

        }
    }
    return fq

}



const names = {
    find: async function (apiKey: string, query: string, bounds?: string, bboxFilter?: string, localType?: LocalType|LocalType[]) {
        if (bounds != null) {
            validateBounds(bounds)
        }
        const fq = buildFq(bboxFilter, localType)
        const params: any = {
            apiKey: apiKey,
            query: query,
            bounds: bounds,
            fq: fq
        }
        return requestOSDataHub(API.NAMES, "find", params)
    },
    nearest: async function (apiKey: string, point: string|[number, number], radius?: number, localType?: LocalType|LocalType[]) {
        return
    }
}
