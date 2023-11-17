import { API_PATH } from '../common/common.js';
import { Server } from './Server.js';
import { api } from '../api/index.js';
import { forecastService } from '../services/services.js';

/**
 * Handler Map
*/
const services = new Map([
    [API_PATH.FORECAST, forecastService],
]);

// Singleton instance
const server = new Server({
    services: services,
    api: api,
});

export { server };
