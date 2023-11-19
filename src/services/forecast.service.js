import { ENV, HTTP_CODE, HTTP_MESSAGE, HTTP_METHOD, HTTP_HEADER, FORECAST_API_PATH } from '../common/common.js';
import { ApiService } from './api.service.js';

class ForecastService extends ApiService {
    /**
     * @return {!ForecastService}
     */
    constructor() {
        super({
            url: ENV.API.FORECAST.API_PATH,
            defaultKeys: {
                ['apikey']: ENV.API.FORECAST.KEY,
                ['details']: true,
                ['metric']: true,
            },
            routeMap: new Map([
                [FORECAST_API_PATH.CURRENT, '/currentconditions/v1/30'],
                [FORECAST_API_PATH.CURRENT_HOURLY, '/currentconditions/v1/30'],
                [FORECAST_API_PATH.FIVE_DAYS, '/forecasts/v1/daily/5day/30'],
                [FORECAST_API_PATH.TEN_DAYS, '/forecasts/v1/daily/10day/30'],
                [FORECAST_API_PATH.FIFTEEN_DAYS, '/forecasts/v1/daily/15day/30'],
            ]),
        });
    }

    /**
     * @params {!Object} params
     * return <!Promise<!Object>>
     */
    async getCurrentForecast(params) {
        const url = this.buildUrlFromParams({
            replaceRoute: FORECAST_API_PATH.CURRENT,
            params: params,
            useDefaultKeys: true
        });

        // Run request
        return await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
            params: params
        });
    }

    /**
     * @params {!Object} params
     * @return <!Promise<!Object>>
     */
    async getCurrentForecastHourly(params) {
        try {
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
