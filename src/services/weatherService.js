import { ENV, HTTP_METHOD, HTTP_HEADER, WEATHER_API_PATH } from '../common/common.js';
import { ApiService } from './api.service.js';

class ForecastService extends ApiService {
    /**
     * @return {!ForecastService}
     */
    constructor() {
        super({
            url: ENV.API.WEATHER.API_PATH,
            defaultKeys: {
                ['appid']: ENV.API.WEATHER.KEY,
                ['temp_unit']: true,
                ['units']: 'metric',
            },
            routeMap: new Map([
                // [WEATHER_API_PATH.CURRENT, '/currentconditions/v1/30'],
                // [WEATHER_API_PATH.CURRENT_HOURLY, '/currentconditions/v1/30'],
                // [WEATHER_API_PATH.FIVE_DAYS, '/forecasts/v1/daily/5day/30'],
            ]),
        });
    }

    /**
     * @params {!Object} params
     * @return <!Promise<!Object>>
     */
    async getCurrentForecastHourly(params) {
        const url = this.buildUrlFromParams({
            replaceRoute: WEATHER_API_PATH.CURRENT_HOURLY,
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
            params: { ...params, exclude: 'minutely,hourly,daily' },
            useDefaultKeys: true
        });

        // Run request
        const apiResponse = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });

        return apiResponse;
    }
};

// Singleton instance
const weatherService = new ForecastService();

export { weatherService };
