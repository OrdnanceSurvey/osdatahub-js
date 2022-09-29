
import fs from 'fs'
import * as dotenv from 'dotenv'

import { osfetch } from '../src/index.mjs'

dotenv.config()

const sampleGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -1.4662456512451172,
                50.94945133437991
              ],
              [
                -1.4598083496093748,
                50.94247528694998
              ],
              [
                -1.4503669738769531,
                50.94891059293974
              ],
              [
                -1.450967788696289,
                50.9501002158044
              ],
              [
                -1.4510536193847656,
                50.95599380724368
              ],
              [
                -1.4534568786621094,
                50.95626413754695
              ],
              [
                -1.4662456512451172,
                50.94945133437991
              ]
            ]
          ]
        }
      }
    ]
  }

async function getData() {

    console.log(process.env.API_KEY)

    let theData = await osfetch.places({
        findBy: ['radius', '-0.114619,51.520516', '300'],
        apiKey: process.env.API_KEY,
        paging: [0, 2000]
    })

    let theDataParsed = JSON.stringify(theData)

    fs.writeFile('tests/output.geojson', theDataParsed, function (err, data) {
        if (err) {
            return console.log(err)
        }
    })

}

getData()