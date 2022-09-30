// src/utils/coords.ts

import proj4 from 'proj4'

export {
    coords
}

/*

    coords.fromBNG
    coords.toBNG
    coords.swivel

*/

const coords = {

    fromBNG: function(ea, no) {

        proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

        var point = proj4('EPSG:27700', 'EPSG:4326', [ea, no])
    
        var lng = Number(point[0].toFixed(4))
        var lat = Number(point[1].toFixed(4))
    
        return { lat: lat, lng: lng }
        
    },

    toBNG: function(lat, lng) {

        proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

        var point = proj4('EPSG:4326', 'EPSG:27700', [parseFloat(lng), parseFloat(lat)])
    
        var ea = Number(point[0].toFixed(0))
        var no = Number(point[1].toFixed(0))
    
        return { ea: ea, no: no }
        
    },

    swivel: function(input) {
        let inputArray = input.split(',')

        if (inputArray.length == 4 ) {
            // bbox
            inputArray = [inputArray[1], inputArray[0], inputArray[3], inputArray[2]]

            // check total area does not exceed 1km^2  against the lat/lng format
            // console.log(((inputArray[2] - inputArray[0]) * (inputArray[3] - inputArray[1]) * 10000))
            // if (((inputArray[2] - inputArray[0]) * (inputArray[3] - inputArray[1]) * 10000) > 1) {
            //     throw new Error('Specified bbox exceeds the permitted extent (1km^2). Aborting.')
            // }

        } else {
            // point
            inputArray = [inputArray[1], inputArray[0]]
        }

        let output = inputArray.toString()
        return output.replaceAll(' ', '')

    }

}