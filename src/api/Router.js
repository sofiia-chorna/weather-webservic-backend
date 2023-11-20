/**
 * Router class for managing and initializing routes in Fastify.
 */
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

    /**
     * @param {import('fastify').Fastify} fastify
     * @param {import('fastify').FastifyServerOptions} _options
     * @param {function()} done
     */
    init(fastify, _options, done) {
        // Register all routes
        for (const [routeName, routeApi] of Router.routes) {
            console.log(`Registering ${routeName}...`);
            fastify.register(routeApi, {
                prefix: routeName
            });
        }
        done();
    }
};

export { Router };
