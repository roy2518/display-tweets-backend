require('dotenv').config();
const fetch = require('node-fetch');
const querystring = require('querystring');

const MAPQUEST_ENDPOINT = 'http://open.mapquestapi.com/nominatim/v1/search.php';

// Accepts an array of location names and returns a map
// of location name to geographic details about the location.
const getLocationDetails = async (locations) => {
  let uniqueLocations = new Set();
  locations.forEach((location) => uniqueLocations.add(location));
  uniqueLocations = Array.from(uniqueLocations);

  // MapQuest only supports one location per request.
  const requests = uniqueLocations.map((location) => {
    const queryParams = {
      key: process.env.MAPQUEST_API_KEY,
      format: 'json',
      q: location,
      limit: 1,
      addressdetails: 1,
    };
    const params = `?${querystring.stringify(queryParams)}`;
    const urlWithParams = `${MAPQUEST_ENDPOINT}${params}`;
    return fetch(urlWithParams);
  });

  const responses = await Promise.all(requests);
  const jsonData = await Promise.all(responses.map((response) => response.json()));

  const result = {};
  uniqueLocations.forEach((location, index) => {
    const locationDetail = jsonData[index][0];
    result[location] = {
      address: locationDetail?.address,
      display_name: locationDetail?.display_name,
      lat: locationDetail?.lat,
      lon: locationDetail?.lon,
    };
  });
  return result;
};

module.exports = {
  getLocationDetails,
};
