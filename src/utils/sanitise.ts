// src/utils/sanitise.ts
import {type validationParams} from '../types'

export {
    validateParams
}

// function validateParams (params: validationParams) {
//
//     if (!params.apiKey) {
//         throw new Error('No API key supplied. Aborting')
//     }
//
//     // need to add swivel
//
//     if (!params.paging) {
//         params.paging = [0, 1000]
//     } else if (params.paging[0] - params.paging[1] > 100 || params.paging[0] == params.paging[1]) {
//         throw new Error('The minimum page value must be less than the maximum page value. Aborting.')
//     } else if (isNaN(params.paging[0]) || isNaN(params.paging[1])) {
//         throw new Error('Min/Max paging values must be integers (and a multiple of 100). Aborting.')
//     } else if (params.paging[0] % 100 != 0 || params.paging[1] % 100 != 0) {
//         throw new Error('Min/Max paging values must be integers (and a multiple of 100). Aborting.')
//     }
//
// }

const validate = {
    apiKey: function (apiKey: string) {
        return true
    },
    paging: function (paging: [number, number]) {
        return true
    },
    radius: function (radius: number) {
        return true
    },
    point: function (point: [number, number]) {
        return true
    },
    bbox: function (bbox: [number, number, number, number]) {
        return true
    },
    uprn: function (uprn: number) {
        return true
    }

}

function validateParams ( params: validationParams) {
    for (let [key, value] of Object.entries(params)) {
        validate[key]? validate[key](value) : null
    }
}