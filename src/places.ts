// src/handlers/handlePlaces.ts

import { coords } from './utils/coords.js' // no longer required as coords.swivel moved
import { request } from './utils/request.js'
import { geojson } from './utils/geojson.js'
import { validateParams } from './utils/sanitise.js'

import { type Config, Options, FeatureCollection, Feature } from './types'

export {
    places
}

function initialiseConfig(apiKey: string, options: Options): Config {
    return {
        url: '',
        key: apiKey,
        body: '',
        method: 'get',
        paging: {
            enabled: true,
            position: options.paging[0],
            startValue: options.paging[0],
            limitValue: options.paging[1],
            isNextPage: true
        }
    }
}

async function requestPlaces(config: Config) {
    let responseObject = await request(config)
    let responseObjectGeoJSON = geojson.into(responseObject)
    return responseObjectGeoJSON
}

const places = {

    polygon: async (apiKey: string, polygon: FeatureCollection | Feature, options: Options) => {

        validateParams({ apiKey, polygon, ...options })

        let config = initialiseConfig(apiKey, options)

        config.url = `https://api.os.uk/search/places/v1/polygon?srs=WGS84`
        config.method = 'post'
        config.body = JSON.stringify(geojson.from(polygon))

        return await requestPlaces(config)

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