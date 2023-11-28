import { Router } from './Router.js';
import { API_PATH } from '../common/common.js';
import { weatherApi } from './weather.api.js';
import { mapApi } from './map.api.js';

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
