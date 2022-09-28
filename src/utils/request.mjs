// src/utils/request.mjs

import { logging } from '../utils/logging.mjs'

import fetch from 'node-fetch' // not required in Node17.5 (LTS) onwards

export {
    request
}

/*

    request.new

*/

const request = {

    new: async function (config) {

        let response, responseObject, responseObjectTemp

        while (config.paging.isNextPage && config.paging.position < config.paging.limitValue) {


            if (config.paging.enabled) {

                logging.info('🔍 ' + config.url + '&offset=' + config.paging.position)

                if (config.method == 'get') {
                    response = await fetch(config.url + '&offset=' + config.paging.position, {
                        method: 'get',
                        headers: {
                            'key': config.key,
                        },
                    })
                } else if (config.method == 'post') {
                    response = await fetch(config.url + '&offset=' + config.paging.position, {
                        method: 'post',
                        headers: {
                            'content-type': 'application/json',
                            'key': config.key,
                        },
                        body: config.body
                    })
                }

            } else {

                logging.info('🔍 ' + config.url)

                if (config.method == 'get') {
                    response = await fetch(config.url, {
                        method: 'get',
                        headers: {
                            'key': config.key,
                        },
                    })
                } else if (config.method == 'post') {
                    response = await fetch(config.url, {
                        method: 'post',
                        headers: {
                            'content-type': 'application/json',
                            'key': config.key,
                        },
                        body: config.body
                    })
                }

            }

            if (response.status != 200) {

                switch (response.status) {
                    case 400:
                        throw new Error(`HTTP 400 (Bad Request - Potential CQL/Bounding Geometry Error)`)
                    case 401:
                        throw new Error(`HTTP 401 (Unauthorized - Check Your API Key)`)
                    default:
                        throw new Error(`HTTP ${response.status}`)
                }
                
            }

            responseObjectTemp = await response.json()

            if (config.paging.position == config.paging.startValue) {
                responseObject = responseObjectTemp
            } else {
                responseObject.results = responseObject.results.concat(responseObjectTemp.results)
            }

            if (!responseObjectTemp.results || responseObjectTemp.results.length == 100) {
                config.paging.position += 100
            } else {
                config.paging.isNextPage = false
            }

        }

        if (config.paging.position == config.paging.limitValue) {
            logging.warn(`🔸 The hard limit (${config.paging.limitValue} features) was reached. Additional features may be available to collect.`)
        } else {
            logging.info(`🔹 All features (${config.paging.position - config.paging.startValue}) have been collected.`)
        }

        return responseObject

    }

}
