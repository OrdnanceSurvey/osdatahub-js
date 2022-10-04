// src/handlers/handleNGD.js

import { request } from './utils/request.js'

import {validateParams} from "./utils/validate";

export {
    handleNGD
}

async function handleNGD(params) {

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

        case 'bbox':
            config.url = `https://ordnance-omse-dev-dev.apigee.net/features/ngd/ofa/v1/collections/${params.featureType}/items?bbox=${params.findBy[1]}`
            if (params.filter) {
                requestProperties.url = `${requestProperties.url}&filter=${params.filter}`
            }
            break

        default:
            throw new Error('Invalid request type supplied. Aborting.')

    }

    let responseObject = await request(config)

    return responseObject
}