// src/handlers/handleNGD.ts

import { request } from './utils/request'

export {
    handleNGD
}

const allowedFeatureTypes = [
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
    'wtr-ntwk-waternode',
]

async function handleNGD(params) {

    if (!params.featureType || !allowedFeatureTypes.includes(params.featureType)) {
        throw new Error('Invalid NGD Feature Type Supplied. Aborting.')
    }

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