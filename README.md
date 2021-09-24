# display-tweets-backend

This is the backend for a [project](https://roy2518.github.io/display-tweets-frontend/) I made that visualizes tweets on a map.

(Checkout the frontend repo [here](https://github.com/roy2518/display-tweets-frontend)!)

## Getting started

1. Clone the repository
2. Run `npm i`

## Setting up locally

#### Environment Variables

Environment variables are stored in a `.env` file at the root of the project.

The following variables are required:

`TWITTER_BEARER_TOKEN` ([OAuth 2.0 Bearer Token](https://developer.twitter.com/en/docs/authentication/oauth-2-0) used to access Twitter API v2)

`MAPQUEST_API_KEY` (See [here](https://developer.mapquest.com/documentation/))

## Running locally

1. `npm run start`
2. Go to `localhost:3000`

`nodemon` is used to restart the application whenever files changes are detected.
