require('dotenv').config();
const fetch = require('node-fetch');
const querystring = require('querystring');

const MAPQUEST_ENDPOINT = 'http://open.mapquestapi.com/nominatim/v1/search.php';

// Perform geocoding
// `locations` is an array of strings, corresponding to the names of different places.
const getLocationDetails = async (locations) => {
    const requests = [];
    locations.forEach((location) => {
        const queryParams = {
            key: process.env.MAPQUEST_API_KEY,
            format: 'json',
            q: location,
            limit: 1,
            addressdetails: 1,
        };
        const params = `?${querystring.stringify(queryParams)}`;
        const urlWithParams = `${URL}${params}`;
        requests.push(fetch(urlWithParams));
    });
    const result = {};
    let locationDetails = await Promise.all(requests);
    locationDetails = locationDetails.map((res) => res.json());
    locationDetails = await Promise.all(locationDetails);
    for (let i = 0; i < locations.length; i += 1) {
        result[locations[i]] = locationDetails[i];
    }
    return result;
};

module.exports = {
    getLocationDetails
};