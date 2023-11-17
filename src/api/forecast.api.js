import { API_PATH, HTTP_METHOD, CONTROLLER_HOOK } from '../common/common.js';

function initForecast(fastify, options, done) {
    // Retrieve services
    const { forecast: forecastService } = options.services;

    // RETRIEVE FORECAST
    fastify.route({
        method: HTTP_METHOD.POST,
        url: API_PATH.ROOT,

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request) => {
            return await forecastService.get(request.body);
        },
    });
    done();
}

export { initForecast };
