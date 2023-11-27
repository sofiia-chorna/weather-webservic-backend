import { MAP_API_PATH, HTTP_METHOD, CONTROLLER_HOOK, HTTP_CODE } from '../common/common.js';
import { mapService } from '../services/services.js';
import { geoService } from '../services/services.js';
import { checkMandatoryParams } from '../helpers/helpers.js';

function mapApi(fastify, _options, done) {
    // Get address from longitude and latitude
    fastify.route({
        method: HTTP_METHOD.GET,
        url: MAP_API_PATH.ADDRESS,

        // Validate lon et lat are present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['longitude', 'latitude']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done();
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await mapService.getAddress(request.query);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    // Get address prediction from user input
    fastify.route({
        method: HTTP_METHOD.GET,
        url: MAP_API_PATH.AUTOCOMPLETE,

        // Validate text is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            const error = checkMandatoryParams(request.query, ['text']);
            if (error) {
                reply.code(HTTP_CODE.BAD_REQUEST).send({ code: HTTP_CODE.BAD_REQUEST, message: error });
                return;
            }

            // All mandatory parameters are present, continue to the route handler
            done();
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await geoService.autocomplete(request.query);
            reply.code(HTTP_CODE.OK).send(result);
        },
    });

    done();
}

export { mapApi };
