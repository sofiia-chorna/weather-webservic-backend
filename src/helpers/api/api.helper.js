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

export { checkMandatoryParams };
