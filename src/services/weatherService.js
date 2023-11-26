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
     * @return <!Promise<!Object>>
     */
    async getDailyForecast(params) {
        const url = this.buildUrlFromParams({
            params: { ...params, exclude: 'hourly' },
            useDefaultKeys: true
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });
        // TODO add check for the error response

        // Pick necessary weather props
        const weather = response.current?.weather?.map((v) => ({ main: v.main, description: v.description })) ?? null;
        const { temp, pressure, humidity, visibility, wind_speed: windSpeed, uvi, clouds, sunrise, sunset } = response.current;
        const { min: tempMin, max: tempMax } = response.daily[0]?.temp ?? {};

        // Calculate precipitation
        const precipitation = Math.max(...response.minutely?.map((v) => v.precipitation)) ?? null;

        // Build response
        return {
            coord: { lon: response.lon, lat: response.lat },
            weather: weather,
            temp: temp,
            temp_min: tempMin,
            temp_max: tempMax,
            pressure: pressure,
            humidity: humidity,
            visibility: visibility,
            wind_speed: windSpeed,
            precipitation: precipitation,
            clouds: clouds,
            uvi: uvi,
            sunrise: sunrise,
            sunset: sunset
        };
    }
}

// Singleton instance
const weatherService = new ForecastService();

export { weatherService };
