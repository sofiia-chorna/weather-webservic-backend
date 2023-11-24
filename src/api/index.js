import { Router } from './Router.js';
import { API_PATH } from '../common/common.js';
import { weatherApi } from './weatherApi.js';

/**
 * Handler Map
 */
const routes = new Map([
    [API_PATH.WEATHER, weatherApi],
]);

// Singleton instance
const router = new Router({
    routes: routes,
});

export { router };
