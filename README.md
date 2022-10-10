# osdatahub (for JavaScript)

> Coding in Python?  
> `osdatahub` has a sibling package for Python developers with similar functionality, [check it out here](https://github.com/OrdnanceSurvey/osdatahub).

`osdatahub` is a JavaScript package from Ordnance Survey (OS) that makes it easier to interact with the OS Data Hub APIs. The package helps you get started with our data in GeoJSON format, and rapidly build prototypes, test new ideas, or collect  data for analyses.

Ordnance Survey is the national mapping agency for Great Britain and produces a large variety of mapping and geospatial products. Much of OS' data is available via the [OS Data Hub](https://osdatahub.os.uk), a platform that hosts both free and premium data products. `osdatahub` provides a user-friendly way to interact with these data products.

## Supported APIs
`osdatahub` (JavaScript) supports the following Ordnance Survey APIs:

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
The `osdatahub` package exclusively uses GeoJSON and lng/lat (`ESPG:4326`) coordinates for returning data, please note that British National Grid coordinates (`ESPG:27700`) **are not supported**. You can use tools such as [bboxfinder.com](http://bboxfinder.com/) or [geojson.io](https://geojson.io/) to collect input geometry for use in `osdatahub`. Responses from non-GeoJSON APIs are returned in specification-compliant GeoJSON format.

- **Pre- and Post- Request Error Handing**  
`osdatahub` will handle some types of error prior to sending a request, such as invalid geometry, or a missing API key. Errors on the server (`HTTP 5**`/`4**` codes) are also handled.

## Installation

You'll need to sign-up for an account on the [OS Data Hub](https://osdatahub.os.uk) to create an API key:

1. Navigate to the *API Dashboard* located on the top navigation bar
2. Go to *My Projects*
3. Click *Create a new project*, give your project a name, then click *Create project*
4. Select *Add an API to this project*
5. Choose the APIs you would like to use and click *Done*

### Installing in NodeJS (via NPM)
Install the `osdatahub` package into your project, via NPM:

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

### Installing in the Browser
We're working hard to bring `osdatahub` to the browser, please watch this space!

## Getting Started
All `osdatahub` commands look something like this:

```javascript
// querying the places API via bbox:
osdatahub.placesAPI.bbox('your-os-api-key', [-1.471237, 50.938189], {
    limit: 200;
})
```

In the example above, we're querying the **OS Places API** using a **Bounding Box** (bbox), and we're specifying a maximum of **200** features should be returned (a total of two requests). Specifying a `limit` value is optional - optional parameters are stored within an object, which is passed in as the final parameter.

Different APIs support different search operations. Let's explore them...

<br>

### OS Places API
The OS Places API can be accessed via `osdatahub.placesAPI`. For further information on using the OS Places API and its capabilities, please refer to the [OS Data Hub](https://osdatahub.os.uk/docs/places/overview) documentation and technical specification.

The OS Places API supports the following optional parameters:
- `offset` - The starting position (default set to 0)
- `limit` - The maximum number of returned features (default set to 1,000)

#### GeoJSON Polygon
Returns all features within the geometry up to the user-defined limit.

```javascript
osdatahub.placesAPI.polygon(apiKey, geoJsonObject, {})
```

#### Point-Based Radius
Returns all features within the geometry (user-defined distance from a point) up to the user-defined limit.

```javascript
osdatahub.placesAPI.radius(apiKey, [lng, lat], searchRadius, {})
```

#### Nearest Features
Returns a single feature, the closest to the geometry (a point).

```javascript
osdatahub.placesAPI.nearest(apiKey, [lng, lat], {})
```

#### Bounding Box
Returns all features within the bbox geometry (up to 1km^2 in area), up to the user-defined limit.

```javascript
osdatahub.placesAPI.bbox(apiKey, bboxArray, {})
```

#### UPRN (Unique Property Reference Number)
Returns a single feature, matching the input UPRN identifier.

```javascript
osdatahub.placesAPI.uprn(apiKey, uprnIdentifer, {})
```

#### Postcode (Full or Partial)
Returns features matching the input postcode. A full (e.g, `SO16 0AS`) or partial (e.g, `OS16`) postcode can be provided, the number of features returned (up to the user-defined limit) can vary considerably.

```javascript
osdatahub.placesAPI.postcode(apiKey, postcodeString, {})
```

#### Find (Plain Text Search)
Returns features matching the input text string provided. The number of features returned (up to the user-defined limit) can vary considerably.

```javascript
osdatahub.placesAPI.postcode(apiKey, plainTextString, {})
```

<br>

### OS Names API
The OS Names API can be accessed via `osdatahub.namesAPI`. For further information on using the OS Names API and its capabilities, please refer to the [OS Data Hub](https://osdatahub.os.uk/docs/names/overview) documentation and technical specification.

The OS Names API supports the following optional parameters:
- `offset` - The starting position (default set to 0)
- `limit` - The maximum number of returned features (default set to 1,000)

#### Nearest Features
Returns a single feature, the closest to the point geometry.

```javascript
osdatahub.namesAPI.nearest(apiKey, [lng, lat], {})
```

#### Find (Plain Text Search)
Returns features matching the input text string provided. The number of features returned (up to the user-defined limit) can vary considerably.

```javascript
osdatahub.namesAPI.postcode(apiKey, plainTextString, {})
```

## Authors
The `osdatahub` (JavaScript) package has been built by:
- [@abiddiscombe](https://github.com/abiddiscombe)
- [@dchirst](https://github.com/dchirst)
- [@jepooley](https://github.com/jepooley)
- [@fhunt-os](https://github.com/fhunt-os)
- [@BenDickens](https://github.com/BenDickens)