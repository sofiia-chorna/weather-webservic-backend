import { WEATHER_API_PATH, HTTP_METHOD, CONTROLLER_HOOK, HTTP_CODE } from '../common/common.js';
import { weatherService } from '../services/services.js';
import { checkMandatoryParams, checkDateParams } from '../helpers/helpers.js';

function weatherApi(fastify, _options, done) {
    // Get Current Forecast
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.CURRENT,

        // Validate lat et lon are present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['lat', 'lon']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getDailyForecast(request.query);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Current Forecast Hourly
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.CURRENT_HOURLY,

        // Validate mandatory params are present
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const errorMandatoryParams = checkMandatoryParams(request.query, ['lat', 'lon', 'date']);
            const errorIncorrectDate = checkDateParams(request.query, ['date']);
            if (errorMandatoryParams || errorIncorrectDate) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: errorMandatoryParams || errorIncorrectDate });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getDailyForecast(request.query, true);
            if (result.code) {
                reply.code(result.code).send({ code: result.code, message: `${result.message}: ${result.parameters?.join(', ')} : ''`});
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Forecast for date period
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.ROOT,

        // Validate mandatory params are present
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const errorMandatoryParams = checkMandatoryParams(request.query, ['lat', 'lon', 'start_date', 'end_date']);
            const dateError = ['start_date', 'end_date'].map((p) => checkDateParams(request.query, [p]))
                .filter((p) => p !== null)
                .join(', ');
            const error = errorMandatoryParams || dateError;
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done()
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getPeriodForecast(request.query);
            if (result.code) {
                reply.code(result.code).send({ code: result.code, message: `${result.message}: ${result.parameters?.join(', ')} : ''`});
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    done();
}

export { weatherApi };
