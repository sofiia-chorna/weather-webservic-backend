import { ENV, HTTP_HEADER, HTTP_METHOD, MAP_API_PATH } from '../common/common.js';
import { ApiService } from './api.service.js';
import { getCountryNameByCode } from '../helpers/helpers.js';

class MapService extends ApiService {
    /**
     * @return {!MapService}
     */
    constructor() {
        super({
            url: ENV.API.MAP.API_PATH,
            defaultKeys: {
                ['appid']: ENV.API.MAP.KEY,
            },
            routeMap: new Map([
                [MAP_API_PATH.ADDRESS, '/reverse'],
            ]),
        });
    }

    /**
     * @params {!Object} params
     * @return <!Promise<!Object>>
     */
    async getAddress(params) {
        const url = this.buildUrlFromParams({
            replaceRoute: MAP_API_PATH.ADDRESS,
            params: { lon: params.longitude, lat: params.latitude },
            useDefaultKeys: true
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON }
        });

        // Correct response
        if (Array.isArray(response) && response.length > 0) {
            const firstEntry = response[0];
            const country = getCountryNameByCode(firstEntry.country);
            return {
                country: country,
                city: firstEntry.name,
                state: firstEntry.state,
                formatted: `${country}, ${firstEntry.state}, ${firstEntry.name}`,
                lat: firstEntry.lat,
                lon: firstEntry.lon
            };
        }

        // API error
        return response;
    }
}

// Singleton instance
const mapService = new MapService();

export { mapService };
