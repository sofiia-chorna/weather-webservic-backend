class Router {
    /**
     * @param {{routes: Map<string, function(*)>}=} params
     * @return {!Router}
     */
    constructor(params) {
        /**
         * @private
         * @constant
         * @type {Map<string, function(*)>}
         */
        Router.routes = params.routes ?? new Map();
    }

    init(fastify, _options, done) {
        // Register all routes
        for (const [routeName, routeApi] of Router.routes) {
            fastify.register(routeApi, {
                prefix: routeName
            });
        }
        done();
    }
};

export { Router };
