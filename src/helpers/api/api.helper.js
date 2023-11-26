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

export { checkMandatoryParams, checkDateParams };
