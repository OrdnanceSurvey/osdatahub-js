// src/utils/sanitise.ts

export {
    validateParams
}

function validateParams (params) {

    if (!params.apiKey) {
        throw new Error('No API key supplied. Aborting')
    }
    
    // need to add swivel

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