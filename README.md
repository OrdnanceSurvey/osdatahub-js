# osfetch
Thank you for your interest in osdatahub, a JavaScript wrapper for Ordnance Survey's Data Hub APIs. It's designed to help users discover and get started with Ordnance Survey (OS) API-based products.

The purpose of osdatahub is to help you get started with our products and rapidly build POCs and test ideas. In production, you may wish to switch to your own code for a more tailored experience.

This package currently supports:

- The OS Names API
- The OS Places API

## Features

- **Abstraction of HTTP requests**  
The process of requesting data from Ordnance Survey APIs is handled internally, so you don't need to worry about HTTP request methods or what to include in the header.

- **Developer-Friendly GeoJSON Responses**  
The osfetch package exclusively uses GeoJSON and lng/lat coordinates for returning data, please note that **ESPG:27700 is not supported**. GeoJSON is a versatile and widely-compatible file format, you can use tools such as [bboxfinder.com](http://bboxfinder.com/) or [geojson.io](https://geojson.io/) to capture input geometry. Responses from non-GeoJSON APIs are returned as specification-compliant GeoJSON documents.

- **Feature Response Pagination**  
The OS Names and OS Places APIs all paginate results at 100 features per request. The osdatahub package provides capability to request multiple pages up to a user defined hard limit. All returned pages worth of features are then merged into a single output.

- **Pre- and Post- Request Error Handing**  
The osfetch package will detect some types of error prior to sending a request, such as an invalid bounding box or a missing API key. In addition, erroroneous responses from the API are caught and reported back to the user.

## Installation

### Browser
*Sorry, browser usage of osfetch is not yet available. We're working on this.*

### Node JS
Install the osfetch package via npm:

```bash
npm install osdatahub
```

Once installed, import the osfetch module into your code:

```javascript
import { * as osdatahub } from 'osdatahub';
```

## Basic Structure
A full list of examples for each API are provided after this section. Generally, most osdatahub commands look something like this:

```javascript
osdatahub.places.radius(
    'your-os-api-key',
    [-1.471237, 50.938189],
    800,
    { limit: 250 }
)
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
