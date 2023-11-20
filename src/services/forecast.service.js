import { ENV, HTTP_METHOD, HTTP_HEADER, FORECAST_API_PATH } from '../common/common.js';
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
            ]),
        });
    }

    /**
     * @params {!Object} params
     * @return <!Promise<!Object>>
     */
    async getCurrentForecastHourly(params) {
        const url = this.buildUrlFromParams({
            replaceRoute: FORECAST_API_PATH.CURRENT_HOURLY,
            params: params,
            useDefaultKeys: true
        });

        // Run request
        return await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });
    }

    /**
     * @params {!Object} params
     * @param {number} numberOfDays
     * @return <!Promise<!Object>>
     */
    async getDailyForecast(params, numberOfDays) {
        const url = this.buildUrlFromParams({
            replaceRoute: FORECAST_API_PATH.FIVE_DAYS,
            params: params,
            useDefaultKeys: true
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });

        // Slice number of days from the response
        if (numberOfDays === 3 || numberOfDays === 1) {
            response['DailyForecasts'] =  response.DailyForecasts.splice(1, numberOfDays);
        }
        return response;
    }
};

// Singleton instance
const forecastService = new ForecastService();

export { forecastService };
