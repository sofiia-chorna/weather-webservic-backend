import { ENV, HTTP_CODE, HTTP_MESSAGE, HTTP_METHOD, HTTP_HEADER } from '../common/common.js';

class ForecastService {
    /**
     * @return {!ForecastService}
     */
    constructor() {
        /**
         * @private
         * @constant
         * @type {string}
         */
        this.API_URL = ENV.API.FORECAST.API_PATH;

        /**
         * @private
         * @constant
         * @type {!Set<string>}
         */
        /**
         * @private
         * @constant
         * @type {!Set<string>}
         */
        this.mandatoryKeys = new Set(['q', 'days']);

        /**
         * @private
         * @constant
         * @type {!Map<string, string>}
         */
        this.defaultKeys = new Map([
            ['key', ENV.API.FORECAST.KEY],
        ]);
    }

    /**
     * @params {!Object} body
     * return <!Array<string>>
     */
    checkMandatoryKeys(body) {
        const missingKeys = [];
        this.mandatoryKeys.forEach((key) => {
            if (!body[key]) {
                missingKeys.push(key);
            }
        });
        return missingKeys;
    }

    /**
     * @params {!Object} body
     * return <string>
     */
    buildForecastParams(body) {
        // Collect default params and params from payload
        const params = Array.from(this.defaultKeys).concat(Object.entries(body));

        // Build URL string with params
        return params.reduce((curUrl, [key, name], index) => {
            const firstSymbol = index === 0 ? '' : '&';
            return `${curUrl}${firstSymbol}${key}=${name}`;
        }, '');
    }

    /**
     * @params {!Object | string} body
     * return <!Promise<!Object>>
     */
    async get(body) {
        try {
            // Get payload as json
            const bodyObject = typeof body === 'string' ? JSON.parse(body) : body;

            // Check if payload has all mandatory keys
            const missingKeys = this.checkMandatoryKeys(bodyObject);
            if (missingKeys.length !== 0) {
                const message = `Missing mandatory keys: ${missingKeys.join(', ')}`;
                return { statusCode: HTTP_CODE.BAD_REQUEST, message: message };
            }

            // Append params
            const requestParams = this.buildForecastParams(bodyObject);

            // Run request
            const response = await fetch(`${this.API_URL}?${requestParams}`, {
                method: HTTP_METHOD.GET,
                headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
            });

            // Convert to json
            const responseObject = await response.json();

            // Handle API error
            return responseObject.statusCode === HTTP_CODE.INTERNAL_SERVER_ERROR
                ? { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: responseObject.message }
                : responseObject;
        }
            // Error while parsing JSON or fetch
        catch (error) {
            console.error(error);
            return { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR };
        }
    }
};

const forecastService = new ForecastService();

export { forecastService };
