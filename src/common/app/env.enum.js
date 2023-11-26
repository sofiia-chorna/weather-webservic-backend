import * as dotenv from 'dotenv';

// Configure reading from .env
dotenv.config();

// Retrieve environment variables
const { APP_PORT, APP_HOST, WEATHER_API_PATH, MAP_API_PATH, FORECAST_API_KEY } = process.env;

/**
  @enum Environment variables
*/
const ENV = {
    APP: {
        PORT: APP_PORT,
        HOST: APP_HOST,
        API_PATH: '/api',
    },
    API: {
        WEATHER: {
            API_PATH: WEATHER_API_PATH,
            KEY: FORECAST_API_KEY
        },
        MAP: {
            API_PATH: MAP_API_PATH,
            KEY: FORECAST_API_KEY
        },
    },
};

export { ENV };
