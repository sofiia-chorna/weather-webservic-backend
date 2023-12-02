import { WEATHER_API_PATH, HTTP_METHOD, CONTROLLER_HOOK, HTTP_CODE } from '../common/common.js';
import { weatherService } from '../services/services.js';
import { validateParams } from '../helpers/helpers.js';

function weatherApi(fastify, _options, done) {
    // Get Current Forecast
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.CURRENT,

        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            if (validateParams(request, reply, ['lat', 'lon'], [])) {
                done();
            }
        },

        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getDailyForecast(request.query);
            if (result.statusCode) {
                reply.code(result.statusCode).send(result);
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Current Forecast Hourly
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.HOURLY,

        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            if (validateParams(request, reply, ['lat', 'lon', 'date'], ['date'])) {
                done();
            }
        },

        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getDailyForecast(request.query, true);
            if (result.statusCode) {
                reply.code(result.statusCode).send(result);
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get Forecast for date period
    fastify.route({
        method: HTTP_METHOD.GET,
        url: WEATHER_API_PATH.ROOT,

        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            if (validateParams(request, reply, ['lat', 'lon', 'start_date', 'end_date'], ['start_date', 'end_date'])) {
                done();
            }
        },

        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await weatherService.getPeriodForecast(request.query);
            if (result.statusCode) {
                reply.code(result.statusCode).send(result);
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    done();
}

export { weatherApi };
