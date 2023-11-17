import { API_PATH } from '../common/common.js';
import { initForecast } from './forecast.api.js';

class Api {
    init(fastify, options, done) {
        const { services } = options;

        // Register collection path & service
        fastify.register(initForecast, {
            services: {
                forecast: services.get(API_PATH.FORECAST)
            },
            prefix: API_PATH.FORECAST
        });
        done();
    }
};

export { Api };
