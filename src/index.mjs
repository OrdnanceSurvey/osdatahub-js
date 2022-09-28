// src/index.mjs

/*

    osfetch

    Ordnance Survey GB
    A JavaScript wrapper for the OS Names API, OS Places API, and the OS NGD Features API.

    Contributors
    https://github.com/abiddiscombe

*/

import { handleNGD } from './handleNGD.mjs'
import { handleNames } from './handleNames.mjs'
import { handlePlaces } from './handlePlaces.mjs'

export {
    osfetch
}

const osfetch = {

    ngd: function(params) {
        sanitise(params)
        return handleNGD(params)
    },

    names: function(params) {
        sanitise(params)
        return handleNames(params)
    },

    places: function(params) {
        sanitise(params)
        return handlePlaces(params)
    },

    capabilities: function() {

        let supportedServices = [
            'this                   osfetch.capabilities()',
            'OS Names API           osfetch.names()',
            'OS Places API          osfetch.places()',
            'OS NGD Features API    osfetch.ngd()'
        ]

        console.log('Supported Capabilities:')

        for (let i = 0; i < supportedServices; i++) {
            console.log(supportedServices[i])
        }

    }

}


function sanitise (params) {

    if (!params.apiKey) {
        throw new Error('No API key supplied. Aborting')
    }

    if (!params.findBy) {
        throw new Error('No searchable extent provided. Aborting.')
    }

    if (params.findBy[0] == 'radius' && params.findBy[2] > 1000) {
        throw new Error('Radius is too large, maximum size in 1000. Aborting.')
    }

    if (!params.paging) {
        params.paging = [0, 1000]
    } else if (params.paging[0] - params.paging[1] > 100 || params.paging[0] == params.paging[1]) {
        throw new Error('The minimum page value must be less than the maximum page value. Aborting.')
    } else if (isNaN(params.paging[0]) || isNaN(params.paging[1])) {
        throw new Error('Min/Max paging values must be integers (and a multiple of 100). Aborting.')
    } else if (params.paging[0] % 100 != 0 || params.paging[1] % 100 != 0) {
        throw new Error('Min/Max paging values must be integers (and a multiple of 100). Aborting.')
    }

}