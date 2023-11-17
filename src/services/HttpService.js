import { HTTP_CODE, HTTP_MESSAGE } from '../common/common.js';

class HttpService {
    /**
     * @params {!Object | string} body
     * return <!Promise<!Object>>
     */
    async request(params) {
        const { url, body, method, headers } = params;
        try {
            // Run request
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: body
            });

            // Convert to json
            const responseObject = await response.json();

            // Handle API error
            return responseObject.statusCode === HTTP_CODE.INTERNAL_SERVER_ERROR
                ? { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: responseObject.message }
                : responseObject;
        }
        // Error while fetching
        catch (error) {
            console.error(error);
            return { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR };
        }
    }
}

export { HttpService };
