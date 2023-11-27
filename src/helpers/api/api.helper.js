import { HTTP_CODE, DISTANCE_UNITS, TEMPERATURE_UNITS } from '../../common/common.js';

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
 * @param {!Object} params
 * return {?string}
 */
function checkUnitParams(params) {
    const tempUnit = params['temp_unit']?.toLowerCase();
    const distUnit = params['dist_unit']?.toLowerCase();
    const temperatureUnits = Object.values(TEMPERATURE_UNITS);
    const distanceUnits = Object.values(DISTANCE_UNITS);

    // Check temperature param
    if (tempUnit && !temperatureUnits.includes(tempUnit)) {
        return `Incorrect temp_unit: ${params['temp_unit']}. Expected values: ${temperatureUnits.join(', ')}`;
    }

    // Check distance param
    if (distUnit && !distanceUnits.includes(distUnit)) {
        return `Incorrect dist_unit: ${params['dist_unit']}. Expected values: ${distanceUnits.join(', ')}`;
    }

    return null;
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
    const unitParamsError = checkUnitParams(request.query);

    // Send error if needed
    const error = mandatoryParamsErrors || dateValidationErrors || unitParamsError;
    if (error) {
        reply.code(errorCode).send({ code: errorCode, message: error });
        return false;
    }

    // No errors
    return true;
}

export { checkMandatoryParams, checkDateParams, validateParams };
