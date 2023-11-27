import { HTTP_CODE } from '../../common/http/http-code.enum.js';

/**
 * @param {!Object} params
 * @param {!Array<string>} mandatoryKeys
 * return {?string}
 */
function checkMandatoryParams(params, mandatoryKeys) {
    const missingKeys = mandatoryKeys.filter((key) => !(key in params));
    return missingKeys.length !== 0 ? `Missing parameter(s): ${missingKeys.join(', ')}` : null;
}

/**
 * @param {!Object} params
 * @param {!Array<string>} dateKeys
 * return {?string}
 */
function checkDateParams(params, dateKeys) {
    // Regular expression for YYYY-MM-DD format
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    const incorrectDateKeys = dateKeys.filter((key) => !dateFormatRegex.test(params[key]));

    // Build error message if applied
    return incorrectDateKeys.length !== 0
        ? `Incorrect date parameter(s): ${incorrectDateKeys.join(', ')}. Expected format: YYYY-MM-DD`
        : null;
}

/**
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply
 * @param {!Array<string>} mandatoryParams
 * @param {!Array<string>} dateParams
 * @param {number} [errorCode=400]
 * @return {boolean}
 */
function validateParams(request, reply, mandatoryParams, dateParams, errorCode = HTTP_CODE.BAD_REQUEST) {
    // Check correctness
    const mandatoryParamsErrors = checkMandatoryParams(request.query, mandatoryParams);
    const dateValidationErrors = dateParams
        .map((param) => checkDateParams(request.query, [param]))
        .filter((error) => error !== null)
        .join(', ');

    // Send error if needed
    const error = mandatoryParamsErrors || dateValidationErrors;
    if (error) {
        reply.code(errorCode).send({ code: errorCode, message: error });
        return false;
    }

    // No errors
    return true;
}

export { checkMandatoryParams, checkDateParams, validateParams };
