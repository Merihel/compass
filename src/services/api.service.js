const ApiGateway = require("moleculer-web");
const E = require("moleculer-web").Errors;
const LG = require("../utils/Logger")
const LOGGER = new LG("API")


const service = {
    name: "api",
    mixins: [ApiGateway],
    settings: {
        cors: {
            origin: "*",
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            allowedHeaders: "*",
        },
		// Exposed port
		port: process.env.BROKER_PORT || 3001,
		// Exposed IP
		ip: "0.0.0.0",
		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],
        routes: [			{
			path: "/api",
			// Route CORS settings (overwrite global settings)
			whitelist: [
				"**"
			],
			// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
			use: [],
			// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
			mergeParams: true,
			// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
			authentication: false,
			// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
			authorization: true,
			// The auto-alias feature allows you to declare your route alias directly in your services.
			// The gateway will dynamically build the full routes from service schema.
			autoAliases: true,
			aliases: {},
			// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
			callingOptions: {},
			bodyParsers: {
				json: {
					strict: false,
					limit: "1MB"
				},
				urlencoded: {
					extended: true,
					limit: "1MB"
				}
			},
			// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
			mappingPolicy: "all", // Available values: "all", "restrict"
			// Enable/disable logging
			logging: true
		}],
		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,
    },
    methods: {
        /**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			let user;
			if (token) {
				// Resolve JWT token
				try {
					user = await ctx.call("user.resolveToken", { token });
					if (user) {
						LOGGER.log("Authorized via JWT: " + user.login);
						// Reduce user fields (it will be transferred to other nodes)
						user.password = null
						user.bio = null
						ctx.meta.user = user
						ctx.meta.token = token;
						ctx.meta.userId = user.id;
                        /*
						//CHECKING ROLE VALIDATION
						if(req.$action.role) {
							let toBeAtLeast = await ctx.call("roles.find", {query: {name: req.$action.role}})
							toBeAtLeast=toBeAtLeast[0]
							console.log("At least, need to be:", toBeAtLeast)
							console.log("... while user is:",ctx.meta.role)
							if(!RolesUtils.gotAuthorization(ctx.meta.role, toBeAtLeast)) {
								console.log("Role is NOT authored to do that")
								throw new UnAuthorizedError();
							} else {
								console.log("Role is authored to do that")
							}
						} else {
							console.log("MISSING ROLE PARAMETER IN ACTION", req.$action.role)
							throw new UnAuthorizedError();
						}
                        */
						//It continues to route ! With user !
						//this.logger.info("ctx meta", ctx.meta)
					}
				} catch (err) {
					throw new E.UnAuthorizedError()
					// Ignored because we continue processing if user doesn't exists
				}
			}
			if (!user && (req.$action.authorization || req.$action.authorization == null))
				throw new E.UnAuthorizedError();
		},
    }
}

module.exports = service