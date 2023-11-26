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
     * @params {!Array<!Object>} minutes
     * @params {string} date
     * @return <!Array<!Object>
     */
    getHourPrecipitation(minutes, date) {
        // Convert to milliseconds
        const timestamps = new Date(date * 1000);

        // Get first minute of the hour
        const firstMinute = new Date(timestamps);
        firstMinute.setMinutes(0, 0, 0);

        // Get last minute of the hour
        const lastMinute = new Date(timestamps);
        lastMinute.setMinutes(59, 59, 999);

        // Pick minute precipitations of the hour
        const precipitations = minutes.filter((v) => v.dt > firstMinute && v.dt < lastMinute).map((v) => v.precipitation);

        // Get max value of them
        return Math.max(...precipitations);
    }

    /**
     * @params {!Object} params
     * @params {boolean[false]} hourly
     * @return <!Promise<!Object>>
     */
    async getDailyForecast(params, hourly = false) {
        const url = this.buildUrlFromParams({
            params: params,
            useDefaultKeys: true
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });
        // TODO add check for the error response

        // Hourly Forecast
        if (hourly) {
            const startTime = new Date(`${params.date}T00:00:00`).getTime();
            const endTime = new Date(`${params.date}T23:59:59`).getTime();
            return response.hourly
                // Pick forecast objects related to the current date
                .filter((v) => {
                    const time = new Date(v.dt * 1000).getTime();
                    return time > startTime && time < endTime;
                })

                // Build expected payload
                .map((value) => ({
                        time: value.dt,
                        coord: { lon: response.lon, lat: response.lat },
                        weather: value.weather.map((v) => ({ main: v.main, description: v.description })),
                        temp: value.temp,
                        temp_min: response.daily[0]?.temp.min ?? null,
                        temp_max: response.daily[0]?.temp.max ?? null,
                        pressure: value.pressure,
                        humidity: value.humidity,
                        visibility: value.visibility,
                        wind_speed: value.wind_speed,
                        precipitation: this.getHourPrecipitation(response.minutely, value.dt), // only minutely has precipitation
                        clouds: value.clouds,
                        uvi: value.uvi,
                        sunrise: response.current.sunrise,
                        sunset: response.current.sunset
                    })
                );
        }

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
