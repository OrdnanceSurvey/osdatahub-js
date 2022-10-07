# osfetch

Thank you for your interest in osfetch, a JavaScript wrapper for Ordnance Survey APIs. It's designed to help users discover and get started with Ordnance Survey (OS) API-based products.

The purpose of osfetch is to help you get started with our products and rapidly build POCs and test ideas. In production, you'll likely wish to switch to your own code for a more tailored experience.

- OS Names API
- OS Places API
- OS National Geographic Database (NGD) Features API

## Features

- **Abstraction of HTTP requests**  
  The process of requesting data from Ordnance Survey APIs is handled internally, so you don't need to worry about HTTP request methods or what to include in the header.

- **Developer-Friendly GeoJSON Responses**  
  The osfetch package exclusively uses GeoJSON and lng/lat coordinates for returning data, please note that **ESPG:27700 is not supported**. GeoJSON is a versatile and widely-compatible file format, you can use tools such as [bboxfinder.com](http://bboxfinder.com/) or [geojson.io](https://geojson.io/) to capture input geometry. Responses from non-GeoJSON APIs are returned as specification-compliant GeoJSON documents.

- **Feature Response Pagination**  
  The OS NGD Features, OS Names and OS Places APIs all paginate results at 100 features per request. The osfetch package provides capability to request multiple pages up to a user defined hard limit. All returned pages worth of features are then merged into a single output.

- **Pre- and Post- Request Error Handing**  
  The osfetch package will detect some types of error prior to sending a request, such as an invalid NGD feature type or a missing API key. In addition, erroroneous responses from the API are caught and reported back to the user.

## Installation

### Browser

_Sorry, browser usage of osfetch is not yet available. We're working on this._

### Node JS

Install the osfetch package via npm:

```bash
npm install osfetch
```

Once installed, import the osfetch module into your code:

```javascript
import { osfetch } from "osfetch";
```

To enable logging, add the following line before making requests:

```javascript
osfetch.enableLogging();
```

## Basic Structure

A full list of examples for each API are provided after this section. Generally, most osfetch commands look something like this:

```javascript
osfetch.places({
  findBy: ["radius", "-1.471237,50.938189", "800"],
  apiKey: "your-os-api-key",
  paging: [0, 1000], // optional
});
```

The request is comprised of the following parts:

### `findBy` - the search parameter

The findBy parameter takes a series of values in an array. The first value is always the type of search to perform. Proceeding values then inform osFetch how to handle that search.

Please note that not all findBy types are available for different APIs.

| Type        | Description                                                                                                                                                                               | Paging Support |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `bbox`      | Takes a lng/lat bounding box (up to 1km^2) and returns features within                                                                                                                    | Yes            |
| `polygon`   | Takes a GeoJSON polygon feature and returns features within                                                                                                                               | Yes            |
| `radius`    | Takes a lng/lat point as the second array value, and a radius to search within as the third. The maximum radius is 1000 meters. Returns a circular cut of features surrounding the point. | Yes            |
| `nearest`   | Takes a lng/lat point as the second array value, and returns only the closest feature.                                                                                                    | No             |
| `uprn`      | Takes a UPRN value and returns the related feature(s).                                                                                                                                    | No             |
| `postcode`  | Takes a partial or complete postcode value and returns the related features.                                                                                                              | Yes            |
| `find`      | Takes a search string (e.g., a place name) and returns the related features.                                                                                                              | Yes            |
| `identifer` | Takes an OS identifer value (e.g., USRN, UPRN) and returns the related features                                                                                                           | No             |

### `apiKey` - the authentication parameter

To use OS APIs, you'll need an account on the [OS Data Hub](https://osdatahub.os.uk/). Once registered, create a new project using the APIs you wish to use (with osfetch) in your code.

To authenticate osfetch, pass your API key in as a string here.

### `paging` - the pagination controller

The `paging` parameter is **optional**, if a value is not specified osfetch will attempt to return features 0 to 1,000 - a total of 10 pages (or requests) by default.

Takes an array of two values. The first specifies the starting position to return features from (e.g., 0 = the first feature), this is useful if you wish to continue a partially-completed query. The second parameter limits the results to a page number. Setting this higher will return more features, **but will fire off more requests, which may have financial implications on your API usage**.

The parameter is ignored for some requests where paging is not supported by the API.

### `featureType` - a parameter for NGD use only

The featureType parameter is only available for the OS NGD Features API. It takes a string containing the NGD theme and collection to search by.

## Usage: OS Names API

If you're new to the OS Names API, [please refer to the documentation](https://osdatahub.os.uk/docs/names/overview) to help you get started.

The OS Places API supports the following `findBy` types:

- `nearest`
- `find`

```javascript
osfetch.names({
  findBy: ["find", "The Needles, Isle of Wight"],
  apiKey: "your-os-api-key",
  paging: [0, 1000],
});

osfetch.names({
  findBy: ["nearest", "-1.471130,50.937862"], // uses lng/lat geom
  apiKey: "your-os-api-key",
});
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

```javascript
osfetch.places({
  findBy: ["polygon", someGeoJSON],
  apiKey: "your-os-api-key",
});

osfetch.places({
  findBy: ["radius", "-1.471237,50.938189", "800"], // uses lng/lat geom
  apiKey: "your-os-api-key",
});

osfetch.places({
  findBy: ["bbox", "-1.475335,50.936159,-1.466924,50.939569"], // uses lng/lat geom
  apiKey: "your-os-api-key",
  paging: [0, 4000],
});

osfetch.places({
  findBy: ["nearest", "-1.471237,50.938189"], // uses lng/lat geom
  apiKey: "your-os-api-key",
});

osfetch.places({
  findBy: ["uprn", "200010019924"],
  apiKey: "your-os-api-key",
});

osfetch.places({
  findBy: ["postcode", "SO16 0AS"],
  apiKey: "your-os-api-key",
});

osfetch.places({
  findBy: ["find", "10 Downing Street, London, SW1"],
  apiKey: "your-os-api-key",
});
```

## Usage: OS NGD Features API

If you're new to the OS NGD Features API, [please refer to the documentation (link tbc.)]() to help you get started.

The OS NGD Features API supports the following `findBy` types:

- `bbox`

You can also use a `filter` to pass a Common Query Language filter to the API.

```javascript
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

```javascript
osfetch.linkedIdentifiers({
  findBy: ["identifier", "200010019924"], // searching using a UPRN
  apiKey: "your-os-api-key",
});
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
