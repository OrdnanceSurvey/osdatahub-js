// src/handlers/handleNames.ts

import { coords } from './utils/coords'
import { request } from './utils/request'
import { geojson } from './utils/geojson'

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