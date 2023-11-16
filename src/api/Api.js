import { API_PATH } from '../common/common.js';

class Api {
    /**
     * @param {{services: Map<string, function(*)>, routes: Map<string, function(*)>}=} params
     * @return {!Api}
     */
    constructor(params) {
        /**
         * @private
         * @type {!Map<string, function(*)>}
         */
        this.services = params.services;

        /**
         * @private
         * @type {!Map<string, function(*)>}
         */
        this.routes = params.routes;
    }

    init(fastify, options, done) {
        for (const [serviceName, serviceValue] of this.services.entries()) {
            const route = this.routes.get(serviceName);
            fastify.register(route.init(), {
                services: {
                    [serviceName]: serviceValue,
                },
                prefix: API_PATH.FORECAST
            });
        }
        done();
    }
};

export { Api };
