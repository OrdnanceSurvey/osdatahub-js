// src/handlers/handlePlaces.ts

import { coords } from './utils/coords' // no longer required as coords.swivel moved
import { request } from './utils/request'
import { geojson } from './utils/geojson'
import { validateParams } from './utils/sanitise'

import {type Config, Options, FeatureCollection, Feature, OSDataHubResponse} from './types'

export {
    places
}

function initialiseConfig(apiKey: string, options?: Options): Config {

    let startValue: number;
    let limitValue: number;
    if ((typeof options === "undefined") || !(options.paging)) {
        startValue = 0;
        limitValue = 100;
    } else {
        startValue = options.paging[0]
        limitValue = options.paging[1]
    }
    return {
        url: '',
        key: apiKey,
        body: '',
        method: 'get',
        paging: {
            enabled: true,
            position: startValue,
            startValue: startValue,
            limitValue: limitValue,
            isNextPage: true
        }
    }
}

async function requestPlaces(config: Config): Promise<OSDataHubResponse> {
    let responseObject =  request(config)
    return responseObject
}

const places = {

    polygon: async (apiKey: string, polygon: FeatureCollection | Feature, options?: Options): Promise<OSDataHubResponse> => {

        validateParams({ apiKey: apiKey, findBy: polygon, ...options })
        let config = initialiseConfig(apiKey, options)

        config.url = `https://api.os.uk/search/places/v1/polygon?srs=WGS84`
        config.method = 'post'
        config.body = JSON.stringify(geojson.from(polygon))

        return requestPlaces(config)

    },

    radius: undefined,

    bbox: undefined,

    nearest: undefined,

    uprn: undefined,

    postcode: undefined,

    find: undefined,

}



    // switch (params.findBy[0]) {

    //     case 'polygon':
    //         config.url = `https://api.os.uk/search/places/v1/polygon?srs=WGS84`
    //         config.method = 'post'
    //         config.body = JSON.stringify(geojson.from(params.findBy[1]))
    //         break

    //     case 'radius':
    //         rectifiedCoords = coords.swivel(params.findBy[1])
    //         config.url = `https://api.os.uk/search/places/v1/radius?srs=WGS84&point=${rectifiedCoords}&radius=${params.findBy[2]}`
    //         break

    //     case 'bbox':
    //         rectifiedCoords = coords.swivel(params.findBy[1])
    //         config.url = `https://api.os.uk/search/places/v1/bbox?srs=WGS84&bbox=${rectifiedCoords}`
    //         break

    //     case 'nearest':
    //         rectifiedCoords = coords.swivel(params.findBy[1])
    //         config.url = `https://api.os.uk/search/places/v1/nearest?srs=WGS84&point=${rectifiedCoords}`
    //         config.paging.enabled = false
    //         break
        
    //     case 'uprn':
    //         config.url = `https://api.os.uk/search/places/v1/uprn?output_srs=WGS84&uprn=${params.findBy[1]}`
    //         config.paging.enabled = false
    //         break

    //     case 'postcode':
    //         config.url = `https://api.os.uk/search/places/v1/postcode?output_srs=WGS84&postcode=${params.findBy[1]}`
    //         break

    //     case 'find':
    //         config.url = `https://api.os.uk/search/places/v1/find?output_srs=WGS84&query=${params.findBy[1]}`
    //         break

    //     default:
    //         throw new Error('Invalid findBy type supplied. Aborting.')

    // }