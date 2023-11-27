import { ENV, HTTP_HEADER, HTTP_METHOD, MAP_API_PATH } from '../common/common.js';
import { ApiService } from './api.service.js';
import { getUniqueByKey } from '../helpers/array/array.helper.js';

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
     * @return {!Promise<!Array<!Object>>}
     */
    async autocomplete(options) {
        const url = this.buildUrlFromParams({
            replaceRoute: MAP_API_PATH.AUTOCOMPLETE,
            params: { ...options, bias: `proximity:${options.bias}` },
            useDefaultKeys: true,
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
        });

        // Format payload
        const entries = response.features.map(({ properties: { country, state, city, lon, lat }}) => (
            { country, state, city, lon, lat, formatted: `${country}, ${state}, ${city}`}
        ));

        // Filter by city key
        return getUniqueByKey(entries, 'city');
    }
}

// Singleton instance
const geoService = new GeoService();

export { geoService };
