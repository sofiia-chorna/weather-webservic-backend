import { ENV, HTTP_METHOD, HTTP_HEADER, WEATHER_API_PATH } from '../common/common.js';
import { formatDate, dateToTimestampInSeconds, generateRandomOffset, addOffset } from '../helpers/helpers.js';
import { ApiService } from './api.service.js';

class WeatherService extends ApiService {
    /**
     * @return {!WeatherService}
     */
    constructor() {
        super({
            url: ENV.API.WEATHER.API_PATH,
            defaultKeys: {
                ['appid']: ENV.API.WEATHER.KEY,
                ['units']: 'metric',
            },
            routeMap: new Map([
                [WEATHER_API_PATH.ROOT, '/timemachine'],
            ]),
        });
    }

    /**
     * @params {!Array<!Object>} minutes
     * @params {string} date
     * @return {<!Array<!Object>}
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
     * @params {!Array<!Object>} weather
     * @return <!Array<!Object>}
     */
    pickDataFromWeather(weather) {
        return weather.map((v) => ({ main: v.main, description: v.description }));
    }

    /**
     * @param {!Object} params
     * @param {boolean[false]} hourly
     * @return {!Promise<!Object>}
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

        // Catch API errors
        if (response.code) {
            return response;
        }

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
                        weather: this.pickDataFromWeather(value.weather),
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

        // Pick necessary properties
        const { temp, pressure, humidity, visibility, wind_speed: windSpeed, uvi, clouds, sunrise, sunset } = response.current;

        // Build response
        return {
            coord: { lon: response.lon, lat: response.lat },
            weather: this.pickDataFromWeather(response.current.weather),
            temp: temp,
            temp_min: response.daily[0]?.temp.min ?? null,
            temp_max: response.daily[0]?.temp.max ?? null,
            pressure: pressure,
            humidity: humidity,
            visibility: visibility,
            wind_speed: windSpeed,
            precipitation: Math.max(...response.minutely?.map((v) => v.precipitation)) ?? null,
            clouds: clouds,
            uvi: uvi,
            sunrise: sunrise,
            sunset: sunset
        };
    }

    /**
     * @params {!Object} params
     * @return <!Promise<!Array<!Object>>>
     */
    async getPeriodForecast(params) {
        const result = [];

        // Pick dates from request params
        const { start_date: startDate, end_date: endDate } = params;

        // Iterate in the date period
        const curDate = new Date(startDate);
        while (curDate <= new Date(endDate))
        {
            const url = this.buildUrlFromParams({
                params: { lat: params.lat, lon: params.lon, dt: dateToTimestampInSeconds(curDate)  },
                replaceRoute: WEATHER_API_PATH.ROOT,
                useDefaultKeys: true
            });

            // Run request
            const response = await this.request({
                url: url,
                method: HTTP_METHOD.GET,
                headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
            });

            // Date is not available
            if (response.code ?? response.cod) {
                result.push({ coord: { lon: params.lon, lat: params.lat }, date: formatDate(curDate), weather: [] });
            }

            // Date available
            else {
                const dayWeather = response.data[0];
                result.push({
                    coord: { lon: response.lon, lat: response.lat },
                    weather: this.pickDataFromWeather(dayWeather.weather),
                    temp: dayWeather.temp,
                    temp_min: addOffset(dayWeather.temp, -generateRandomOffset()), // mock, no data
                    temp_max: addOffset(dayWeather.temp, generateRandomOffset()), // mock, no data
                    pressure: dayWeather.pressure,
                    humidity: dayWeather.humidity,
                    visibility: dayWeather.visibility,
                    wind_speed: dayWeather.wind_speed,
                    precipitation: 0, // mock, no data
                    clouds: dayWeather.clouds,
                    uvi: Number(Math.random(10).toFixed(2)), // mock, no data
                    sunrise: dayWeather.sunrise,
                    sunset: dayWeather.sunset,
                    date: formatDate(dayWeather.dt)
                });
            }

            // Increment date
            curDate.setDate(curDate.getDate() + 1);
        }

        // Done
        return result;
    }
}

// Singleton instance
const weatherService = new WeatherService();

export { weatherService };
