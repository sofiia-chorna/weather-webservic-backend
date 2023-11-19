import { Router } from './Router.js';
import { API_PATH } from '../common/common.js';
import { forecastApi } from './forecast.api.js';

/**
 * Handler Map
 */
const routes = new Map([
    [API_PATH.FORECAST, forecastApi],
]);

// Singleton instance
const router = new Router({
    routes: routes,
});

export { router };
