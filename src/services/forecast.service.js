import { ENV, HTTP_CODE, HTTP_MESSAGE, HTTP_METHOD, HTTP_HEADER } from '../common/common.js';
import { HttpService } from './http.service.js';

class ForecastService extends HttpService {
    /**
     * @return {!ForecastService}
     */
    constructor() {
        super();

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
        this.mandatoryKeys = new Set([]);

        /**
         * @private
         * @constant
         * @type {!Map<string, string>}
         */
        this.defaultKeys = new Map([
            ['apikey', ENV.API.FORECAST.KEY],
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
    async getCurrentForecast(body) {
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
            const response = await this.request({
                url: `${this.API_URL}?${requestParams}`,
                method: HTTP_METHOD.GET,
                headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
            });

            // Return answer
            return response;
        }
        // Error while parsing JSON
        catch (error) {
            console.error(error);
            return { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR };
        }
    }
};

// Singleton instance
const forecastService = new ForecastService();

export { forecastService };
