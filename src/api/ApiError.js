class ApiErrorBase {
    /**
     * @param {number} code
     * @param {string} message
     * @return {!Object}
     */
    create(code, message) {
        return { statusCode: code, message: message };
    }
}

const ApiError = new ApiErrorBase();

export { ApiError };
