import { ENV, HTTP_HEADER, HTTP_METHOD, MAP_API_PATH } from '../common/common.js';
import { ApiService } from './abstract/api.service.js';
import { getUniqueBy } from '../helpers/array/array.helper.js';

class GeoService extends ApiService {
    /**
     * @return {!GeoService}
     */
    constructor() {
        super({
            url: ENV.API.GEO.API_PATH,
            defaultKeys: {
                ['apiKey']: ENV.API.GEO.KEY,
            },
            routeMap: new Map([
                [MAP_API_PATH.AUTOCOMPLETE, '/autocomplete'],
            ]),
        });
    }

    /**
     * @param {!Object} options
     * @return {Promise<!Object>}
     */
    async autocomplete(options) {
        const params = options.bias ? { ...options, bias: `proximity:${options.bias}` } : options;
        const url = this.buildUrlFromParams({
            replaceRoute: MAP_API_PATH.AUTOCOMPLETE,
            params: params,
            useDefaultKeys: true,
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
        });

        // Catch API errors
        if (response.error) {
            return this.createError(response.statusCode, response.message);
        }

        // Format payload
        const entries = response.features?.map(({ properties: { country, state, city, lon, lat }}) => (
            { country, lon, lat, state: state ?? city, city: city ?? null, formatted: `${country}, ${state ?? city}${city ? `, ${city}` : ''}`}
        )) ?? [];

        // Filter by city.country key
        return getUniqueBy(entries, (item) => `${item['city']}.${item['country']}`);
    }
}

// Singleton instance
const geoService = new GeoService();

export { geoService };
