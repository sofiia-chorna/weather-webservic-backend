import { Api } from './Api.js';
import { API_PATH } from '../common/common.js';
import { forecastService } from '../services/services.js';

const services = new Map([
    [API_PATH.FORECAST, forecastService],
]);

// Singleton instance
const api = new Api({ services: services });

export { api };
