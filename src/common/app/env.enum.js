import * as dotenv from 'dotenv';

// Configure reading from .env
dotenv.config();

// Retrieve environment variables
const { APP_PORT, APP_HOST, API_PATH } = process.env;

/*
  @enum Environment variables
**/
const ENV = {
    APP: {
        PORT: APP_PORT,
        HOST: APP_HOST,
        API_PATH: API_PATH,
    },
};

export { ENV };
