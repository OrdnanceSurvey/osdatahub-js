// src/index.mjs

/*

    osfetch

    Ordnance Survey GB
    A JavaScript wrapper for the OS Names API, OS Places API, and the OS NGD Features API.

    Contributors
    https://github.com/abiddiscombe

*/

import { sanitiseParams } from './utils/sanitise.mjs'

import { handleNGD } from './handleNGD.mjs'
import { handleNames } from './handleNames.mjs'
import { handlePlaces } from './handlePlaces.mjs'

export {
    osfetch
}

const osfetch = {

    ngd: function(params) {
        sanitiseParams(params)
        return handleNGD(params)
    },

    names: function(params) {
        sanitiseParams(params)
        return handleNames(params)
    },

    places: function(params) {
        sanitiseParams(params)
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