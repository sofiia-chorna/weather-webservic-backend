import { ENV, HTTP_HEADER, HTTP_METHOD, MAP_API_PATH, LANG, HTTP_CODE, HTTP_MESSAGE } from '../common/common.js';
import { ApiService } from './abstract/api.service.js';
import { getUniqueBy, offsetStringToNumber } from '../helpers/helpers.js';

class GeoService extends ApiService {
    /**
     * @return {!GeoService}
     */
    constructor() {
        super({
            url: ENV.API.GEO.API_PATH,
            defaultKeys: {
                ['apiKey']: ENV.API.GEO.KEY,
                ['type']: 'city',
                ['lang']: LANG.EN,
            },
            routeMap: new Map([
                [MAP_API_PATH.AUTOCOMPLETE, '/autocomplete'],
                [MAP_API_PATH.ADDRESS, '/reverse'],
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
        return this.processApiRequest(url);
    }

    /**
     * @param {!Object} options
     * @return {Promise<!Object>}
     */
    async getAddress(options) {
        const url = this.buildUrlFromParams({
            replaceRoute: MAP_API_PATH.ADDRESS,
            params: options,
            useDefaultKeys: true,
        });
        return this.processApiRequest(url, true);
    }

    /**
     * @param {string} url
     * @param {boolean} useFirstEntry
     * @return {Promise<!Object>}
     */
    async processApiRequest(url, useFirstEntry = false) {
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

        const entries = response.features;
        if (useFirstEntry && Array.isArray(entries)) {
            const firstEntry = entries[0];
            return firstEntry
                ? this.formatPayload(firstEntry)
                : this.createError(HTTP_CODE.NOT_FOUND, HTTP_MESSAGE.NOR_FOUND);
        }

        // Format to the necessary scheme
        const cities = entries?.map(this.formatPayload) ?? [];
        return getUniqueBy(cities, (item) => `${item.city}.${item.country}`);
    }

    /**
     * @param {!Object} entry
     * @return {!Object}
     */
    formatPayload(entry) {
        // Pick fields
        const { properties: { country, state, city, lon, lat, timezone }} = entry;

        // Get desired format
        return {
            country: country,
            lon: lon,
            lat: lat,
            city: city,
            state: state ?? city,
            formatted: `${country}, ${state ?? city}${city ? `, ${city}` : ''}`,
            timezone_offset: offsetStringToNumber(timezone.offset_STD),
        };
    }
}

// Singleton instance
const geoService = new GeoService();

export { geoService };
