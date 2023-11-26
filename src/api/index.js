import { Router } from './Router.js';
import { API_PATH } from '../common/common.js';
import { weatherApi } from './weatherApi.js';
import { mapApi } from './mapApi.js';

/**
 * Handler Map
 */
const routes = new Map([
    [API_PATH.WEATHER, weatherApi],
    [API_PATH.MAP, mapApi],
]);

// Singleton instance
const router = new Router({
    routes: routes,
});

export { router };
