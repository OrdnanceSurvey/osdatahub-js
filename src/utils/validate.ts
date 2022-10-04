// src/utils/validate.ts

import { logging } from './logging'

import {type ValidationParams} from '../types'

export {
    validateParams
}

// todo: convert to set, or catch at request stage

const ngdValidFeatureTypes = [
    'bld-fts-buildingline',
    'bld-fts-buildingpart',
    'gnm-fts-namedpoint',
    'lnd-fts-land',
    'lnd-fts-landform',
    'lnd-fts-landformline',
    'lnd-fts-landformpoint',
    'lnd-fts-landpoint',
    'lus-fts-site',
    'lus-fts-siteaccesslocation',
    'lus-fts-siteroutingpoint',
    'str-fts-compoundstructure',
    'str-fts-structure',
    'str-fts-structureline',
    'str-fts-structurepoint',
    'trn-fts-cartographicraildetail',
    'trn-fts-rail',
    'trn-fts-roadline',
    'trn-fts-roadtrackorpath',
    'trn-ntwk-connectinglink',
    'trn-ntwk-connectingnode',
    'trn-ntwk-ferrylink',
    'trn-ntwk-ferrynode',
    'trn-ntwk-ferryterminal',
    'trn-ntwk-path',
    'trn-ntwk-pathlink',
    'trn-ntwk-pathnode',
    'trn-ntwk-road',
    'trn-ntwk-roadjunction',
    'trn-ntwk-roadlink',
    'trn-ntwk-roadnode',
    'trn-ntwk-street',
    'trn-rami-highwaydedication',
    'trn-rami-maintenancearea',
    'trn-rami-maintenanceline',
    'trn-rami-maintenancepoint',
    'trn-rami-reinstatementarea',
    'trn-rami-reinstatementline',
    'trn-rami-reinstatementpoint',
    'trn-rami-restriction',
    'trn-rami-routinghazard',
    'trn-rami-routingstructure',
    'trn-rami-specialdesignationarea',
    'trn-rami-specialdesignationline',
    'trn-rami-specialdesignationpoint',
    'wtr-fts-intertidalline',
    'wtr-fts-tidalboundary',
    'wtr-fts-water',
    'wtr-fts-waterpoint',
    'wtr-ntwk-waterlink',
    'wtr-ntwk-waterlinkset',
    'wtr-ntwk-waternode'
]

const validate: {[key: string]: Function } = {

    apiKey: function (apiKey: string) {
        if (!apiKey) {
            throw new Error('No API key supplied. Aborting.')
        }
        return true
    },
    paging: function (paging: [number, number]) {
        if (paging[0] == 0 && paging[1] == 1000) {
            logging.info('No paging value was supplied, using the default of pages 0 to 10.')
        } else if (paging[0] - paging[1] > 100 || paging[0] == paging[1]) {
            throw new Error('The minimum page value must be less than the maximum page value. Aborting.')
        } else if (isNaN(paging[0]) || isNaN(paging[1])) {
            throw new Error('Min/Max paging values must be integers . Aborting.')
        }
        return true
    },
    radius: function (radius: number) {
        if (radius < 1 || radius > 1000) {
            throw new Error(`The supplied radius value (${radius} must be be between 1 and 1000 meters.`)
        }
        return true
    },
    point: function (point: [number, number]) {
        // todo: check within UK bounds?
        return true
    },
    bbox: function (bbox: [number, number, number, number]) {
        // todo: check within UK bounds?
        // todo: check max bbox size less than 1km2?
        return true
    },
    ngd : function(ngdFeatureType: string) {
        if (!ngdValidFeatureTypes.includes(ngdFeatureType)) {
            throw new Error(`Unrecognised NGD FeatureType '${ngdFeatureType}'. Aborting.`)
        }
    }

}

function validateParams ( params: ValidationParams) {
    for (const [key, value] of Object.entries(params)) {
        validate[key]? validate[key](value) : null
    }
}