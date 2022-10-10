# osdatahub (for JavaScript)

> Coding in Python?  
> `osdatahub` has a sibling package for Python developers with similar functionality, [check it out here](https://github.com/OrdnanceSurvey/osdatahub).

`osdatahub` is a JavaScript package from Ordnance Survey (OS) that makes it easier to interact with the OS Data Hub APIs. The package helps you get started with our data in GeoJSON format, and rapidly build prototypes, test new ideas, or collect  data for analyses.

Ordnance Survey is the national mapping agency for Great Britain and produces a large variety of mapping and geospatial products. Much of OS's data is available via the [OS Data Hub](https://osdatahub.os.uk), a platform that hosts both free and premium data products. `osdatahub` provides a user-friendly way to interact with these data products.

## Supported APIs
`osdatahub` supports the following Ordnance Survey APIs:

- [x] OS Names API
- [x] OS Places API
- [ ] OS NGD Features API (Coming Soon!)

## Features

- **Access to Ordnance Survey data in 2 lines of code**  
This wrapper abstracts the HTTP request process, so you can get to work on your geospatial project without configuring API endpoints.

- **Find features via geospatial and textual queries**  
Use all available geospatial and textual search methods supported by each OS API to find and return data.

- **Request as much data as you need with automatic API paging**  
By default, `osdatahub` will attempt to return a maximum of 1000 features. You can customise this by setting custom start (`offset`) and end (`limit`) values. Where multiple requests are required, `osdatahub` will merge these into a single response object. *Please note that requesting a large amount of data may have cost implications.*

- **Developer-Friendly GeoJSON Responses**  
The `osdatahub` package exclusively uses GeoJSON and lng/lat (`ESPG:3857`) coordinates for returning data, please note that British National Grid coordinates (`ESPG:27700`) **are not supported**. You can use tools such as [bboxfinder.com](http://bboxfinder.com/) or [geojson.io](https://geojson.io/) to collect input geometry for use in `osdatahub`. Responses from non-GeoJSON APIs are returned in specification-compliant GeoJSON format.

- **Pre- and Post- Request Error Handing**  
The package will handle some types of error prior to sending a request, such as invalid geometry, or a missing API key.

## Installation

### Getting an API Key
You'll need to sign-up for an account on the [OS Data Hub](https://osdatahub.os.uk) to get an API key:

1. Navigate to the API Dashboard located on the top navigation bar
2. Go to My Projects
3. Click Create a new project, give your project a name, then click Create project
4. Select Add an API to this project
5. Choose the APIs you would like to use and click Done

### NodeJS (via NPM)
Install the `osdatahub` package into your project:

```bash
npm install osdatahub
```

You can then import `osdatahub` into your code:

```javascript
// option 1 - import all the things (suggested)
import { * as osdatahub } from 'osdatahub';

// option 2 - import specific modules
import { placesAPI } from 'osdatahub';
```

### Browser Usage
We're working hard to bring `osdatahub` to the browser, please watch this space!

## Getting Started
All `osdatahub` commands look something like this:

```javascript
// querying the places API via bbox:
osdatahub.places.bbox('your-os-api-key', [-1.471237, 50.938189], {
    limit: 200;
})
```

In the example above, we're querying the **OS Places API** using a **Bounding Box** (bbox), and we're specifying a maximum of **200** features should be returned (a total of two requests). Specifying a `limit` value is optional - optional parameters are places within an object, passed in as the last parameter.

Different APIs support different search operations:

### OS Places API (`osdatahub.places`)

#### GeoJSON Polygon

```javascript
osdatahub.places.polygon(apiKey, geoJsonObject, {})
```

- `apiKey` - Your OS DataHub


| API Type           | Search Type   | Compulsory Params | Optional Params |
| ------------------ | ------------- | ----------------- | --------------- |
| `osdatahub.places` | `.polygon`    | `apiKey`,<br> `GeoJSON`| `offset`,<br> `limit`, |
| `osdatahub.places` | `.radius`     | `apiKey`,<br> `LngLat Point`, <br> `SearchRadius` | `offset`,<br> `limit`, |
| `osdatahub.places` | `.nearest`    | `apiKey`,<br> `LngLat Point` | `offset`,<br> `limit`, |
| `osdatahub.places` | `.bbox`       | `apiKey`,<br> `Bbox Array` | `offset




```
osdatahub.places.polygon
                .radius
                .bbox
                .nearest
                .uprn
                .postcode
                .find

osdatahub.names.nearest
               .find
            

```
The request is comprised of the following parts:

### `apiKey` - The authentication parameter
To use OS APIs, you'll need an account on the [OS Data Hub](https://osdatahub.os.uk/). Once registered, create a new project and activate the APIs you wish to use (with osdatahub) in your code.

All osdatahub functions will require an api key as their first argument.

### `point` & `radius` - API specific required arguments
Each API endpoint will have different required arguments (see details below), 
that will be passed in after the api key. In this example, we are giving 
the radius function a center coordinate `[-1.471237, 50.938189]` and a 
search radius in meters `800`.

It should, therefore, search for addressess within these constraints.

### `{limit}` - Optional parameters
By default, for any API that could return multiple results, there are two 
optional arguments: `limit` and `offset`. The `limit` argument sets the maximum 
number of features 



## Usage: OS Names API
If you're new to the OS Names API, [please refer to the documentation](https://osdatahub.os.uk/docs/names/overview) to help you get started.

The OS Places API supports the following `findBy` types:
- `nearest`
- `find`

``` javascript
osfetch.names({
    findBy: ['find', 'The Needles, Isle of Wight'],
    apiKey: 'your-os-api-key',
    paging: [0, 1000]
})

osfetch.names({
    findBy: ['nearest', '-1.471130,50.937862'], // uses lng/lat geom
    apiKey: 'your-os-api-key',
})
```


## Usage: OS Places API
If you're new to the OS Places API, [please refer to the documentation](https://osdatahub.os.uk/docs/places/overview) to help you get started.

The OS Places API supports the following `findBy` types:
- `polygon`
- `radius`
- `bbox`
- `nearest`
- `uprn`
- `postcode`
- `find`

``` javascript
osfetch.places({
    findBy: ['polygon', someGeoJSON],
    apiKey: 'your-os-api-key',
})

osfetch.places({
    findBy: ['radius', '-1.471237,50.938189', '800'], // uses lng/lat geom
    apiKey: 'your-os-api-key',
})

osfetch.places({
    findBy: ['bbox', '-1.475335,50.936159,-1.466924,50.939569'], // uses lng/lat geom
    apiKey: 'your-os-api-key',
    paging: [0, 4000]
})

osfetch.places({
    findBy: ['nearest', '-1.471237,50.938189'], // uses lng/lat geom
    apiKey: 'your-os-api-key',
})

osfetch.places({
    findBy: ['uprn', '200010019924'],
    apiKey: 'your-os-api-key',
})

osfetch.places({
  findBy: ['postcode', 'SO16 0AS'],
  apiKey: 'your-os-api-key',
})

osfetch.places({
  findBy: ['find', '10 Downing Street, London, SW1'],
  apiKey: 'your-os-api-key',
})
```


## Usage: OS NGD Features API
If you're new to the OS NGD Features API, [please refer to the documentation (link tbc.)]() to help you get started.

The OS NGD Features API supports the following `findBy` types:
- `bbox`

You can also use a `filter` to pass a Common Query Language filter to the API.


``` javascript
// get all the bld-fts-buildingpart features from around Ordnance Survey HQ:
osfetch.ngd({
    findBy: ['bbox', '-1.474520, 50.935463, -1.468125, 50.940442'], // uses lng/lat geom
    featureType: 'bld-fts-buildingpart',
    filter: 'a-CQL-filter-goes-here' // optional
    apiKey: 'your-os-api-key',
})
```

## Usage: OS Linked Identifiers API
If you're new to the OS Linked Identifiers API, [please refer to the documentation](https://osdatahub.os.uk/docs/linkedIdentifiers/overview) to help you get started.

**Please note that the Linked Identifers API does NOT return a GeoJSON response, as the data does not contain geometry. The Linked Identifers API can be used to get the identifers of other features, which can then be searched for in a seperate query.**

The OS Linked Identifiers API supports the following `findBy` types:
- `identifer`

``` javascript
osfetch.linkedIdentifiers({
  findBy: ['identifier', '200010019924'], // searching using a UPRN
  apiKey: 'your-os-api-key',
})
```


## Authors
The osfetch package has been built by:
- [@abiddiscombe](https://github.com/abiddiscombe)


## To-Do
This code is under development. Changes may break previous versions. If you have an idea, or spot a bug, please get in touch and let us know!

Planned Additions/Changes:
- [ ] Support for other Linked Identifier findBy types.
- [ ] Reduced code repetition between handlers.
- [ ] Intelligent lng/lat order switching - do not change order if already in lat/lng.
- [ ] Support for non-DPA Places API responses
