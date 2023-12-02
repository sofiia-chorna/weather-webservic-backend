import { MAP_API_PATH, HTTP_METHOD, CONTROLLER_HOOK, HTTP_CODE } from '../common/common.js';
import { geoService } from '../services/services.js';
import { validateAndTransformResponse, validateParams } from '../helpers/helpers.js';
import { addressSchema, addressSchemaArray } from '../models/models.js';

function mapApi(fastify, _options, done) {
    // Get address from longitude and latitude
    fastify.route({
        method: HTTP_METHOD.GET,
        url: MAP_API_PATH.ADDRESS,

        // Validate lon et lat are present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            if (validateParams(request, reply, ['lon', 'lat'], [])) {
                done();
            }
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await geoService.getAddress(request.query);
            if (result.statusCode) {
                reply.code(result.statusCode).send(result);
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },

        [CONTROLLER_HOOK.ON_SEND]: async (_request, reply, payload) => validateAndTransformResponse(reply, payload, addressSchema),
    });

    // Get address prediction from user input
    fastify.route({
        method: HTTP_METHOD.GET,
        url: MAP_API_PATH.AUTOCOMPLETE,

        // Validate text is present in the params
        [CONTROLLER_HOOK.ON_REQUEST]: (request, reply, done) => {
            if (validateParams(request, reply, ['text'], [])) {
                done();
            }
        },

        // Handle request
        [CONTROLLER_HOOK.HANDLER]: async (request, reply) => {
            const result = await geoService.autocomplete(request.query);
            if (result.statusCode) {
                reply.code(result.statusCode).send(result);
                return;
            }
            reply.code(HTTP_CODE.OK).send(result);
        },

        [CONTROLLER_HOOK.ON_SEND]: async (_request, reply, payload) => validateAndTransformResponse(reply, payload, addressSchemaArray),
    });

    done();
}

export { mapApi };
