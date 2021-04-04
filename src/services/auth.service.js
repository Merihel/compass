const Utils = require("../utils/Utils")
const jwt = require("jsonwebtoken");
//errors
const { MoleculerClientError } = require("moleculer").Errors;

const service = {
    name: "auth",
    settings: {
		/** Secret for JWT */
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
    },
    actions: {
        /**
		 * Authenticate with username & password
		 *
		 * @actions
		 * @param {String} email - User email 
		 * @param {String} password - User password
		 *
		 * @returns {Object} Logged in user with token
		 */
		authenticate: {
			rest: "POST /users/authenticate",
			params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
			authorization: false,
			async handler(ctx) {
				const { email, password } = ctx.params;
				const user = await context.call("users.find", { email })
				if (!user) throw new MoleculerClientError("Email or password is invalid!", 422, "", [{ field: "email", message: "is not found" }]);
                const res = await Utils.compare(password, user.password)
                if (!res) throw new MoleculerClientError("Wrong password!", 422, "", [{ field: "email", message: "is not found" }]);
				let expiresIn = "1h"
                return {
					token: jwt.sign({id: user.id}, this.settings.JWT_SECRET, {expiresIn: expiresIn}),
					expiresIn: expiresIn
				}
			}
		},
        /**
		 * Get user by JWT token (for API GW authentication)
		 *
		 * @actions
		 * @param {String} token - JWT token
		 *
		 * @returns {Object} Resolved user
		 */
		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: {
				token: "string"
			},
			async handler(ctx) {
				const decoded = await new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
						if (err) {
                            LOGGER.error("err", err)
                            return reject(err);
                        } else {
                            resolve(decoded);
                        }
					});
				});
				if (decoded.id)
					return this.find(decoded.id);
            }
		},
        /* OLD AUTHENTICATION
        async authenticate(ctx) {
            rest
            const login = ctx.params.login
            return await ctx.call("user.find", {query: {tag: login}}).then(async res => {
                const user = res[0]
                if(user) {
                    const password = ctx.params.password
                    const match = await Utils.compare(password, user.password)
                    return match
                }
                return await false
            })
        },
        */
    }
}

module.exports = service