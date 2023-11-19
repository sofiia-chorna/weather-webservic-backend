import { Api } from './Api.js';
import { API_PATH } from '../common/common.js';
import { forecastApi } from './forecast.api.js';

/**
 * Handler Map
 */
const routes = new Map([
    [API_PATH.FORECAST, forecastApi],
]);

// Singleton instance
const api = new Api({
    routes: routes,
});

export { api };
