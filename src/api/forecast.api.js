import { FORECAST_API_PATH, HTTP_METHOD, CONTROLLER_HOOK, HTTP_CODE } from '../common/common.js';
import { forecastService } from '../services/services.js';
import { checkMandatoryParams } from '../helpers/helpers.js';

function forecastApi(fastify, _options, done) {
    // Get Current Forecast
    fastify.route({
        method: HTTP_METHOD.GET,
        url: FORECAST_API_PATH.CURRENT,

        // Validate city is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['city']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        [CONTROLLER_HOOK.PRE_HANDLER]: (request, _reply, done) => {
            request.query = { ...request.query, };
            done();
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await forecastService.getDailyForecast(request.query, 1);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Current Forecast Hourly
    fastify.route({
        method: HTTP_METHOD.GET,
        url: FORECAST_API_PATH.CURRENT_HOURLY,

        // Validate city is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['city']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await forecastService.getCurrentForecastHourly(request.query);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Forecast for tomorrow
    fastify.route({
        method: HTTP_METHOD.GET,
        url: FORECAST_API_PATH.TOMORROW,

        // Validate city is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['city']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await forecastService.getDailyForecast(request.query, 1);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Forecast for 3 days
    fastify.route({
        method: HTTP_METHOD.GET,
        url: FORECAST_API_PATH.THREE_DAYS,

        // Validate city is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['city']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await forecastService.getDailyForecast(request.query, 3);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Forecast for 5 days
    fastify.route({
        method: HTTP_METHOD.GET,
        url: FORECAST_API_PATH.FIVE_DAYS,

        // Validate city is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['city']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await forecastService.getDailyForecast(request.query, 5);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    done();
}

export { forecastApi };
