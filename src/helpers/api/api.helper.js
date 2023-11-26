/**
 * @params {!Object} params
 * @params {!Array<string>} mandatoryKeys
 * return <?string>
 */
function checkMandatoryParams(params, mandatoryKeys) {
    const missingKeys = [];
    mandatoryKeys.forEach((key) => {
        if (!Object.keys(params).includes(key)) {
            missingKeys.push(key);
        }
    });
    return missingKeys.length !== 0 ? `Missing parameter: ${missingKeys.join(', ')}` : null;
}

/**
 * @params {!Object} params
 * @params {!Array<string>} dateKeys
 * return <?string>
 */
function checkDateParams(params, dateKeys) {
    // Regular expression for YYYY-MM-DD format
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Validate date properties
    const incorrectDateKeys = [];
    Object.entries(params).filter(([k]) => dateKeys.includes(k)).forEach(([k, v]) => {
        if (!dateFormatRegex.test(v)) {
            incorrectDateKeys.push(k);
        }
    });

    // Build error message if applied
    return incorrectDateKeys.length !== 0
        ? `Incorrect parameters: ${incorrectDateKeys.join(', ')}. Expected format: YYYY-MM-DD`
        : null;
}

export { checkMandatoryParams, checkDateParams };
