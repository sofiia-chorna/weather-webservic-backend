import { FORECAST_API_PATH, HTTP_METHOD, CONTROLLER_HOOK } from '../common/common.js';
import { forecastService } from '../services/services.js';

function forecastApi(fastify, _options, done) {
    // Get Current Forecast
    fastify.route({
        method: HTTP_METHOD.POST,
        url: FORECAST_API_PATH.CURRENT,

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request) => {
            return await forecastService.getCurrentForecast(request.body);
        },
    });
    done();
}

export { forecastApi };
