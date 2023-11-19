class Api {
    /**
     * @param {{routes: Map<string, function(*)>}=} params
     * @return {!Api}
     */
    constructor(params) {
        /**
         * @private
         * @constant
         * @type {Map<string, function(*)>}
         */
        Api.routes = params.routes ?? new Map();
    }

    init(fastify, _options, done) {
        // Register all routes
        for (const [routeName, routeApi] of Api.routes) {
            fastify.register(routeApi, {
                prefix: routeName
            });
        }
        done();
    }
};

export { Api };
