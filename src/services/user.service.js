const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
//errors
const { MoleculerClientError } = require("moleculer").Errors;
//---
const LG = require("../utils/Logger")
const LOGGER = new LG("USER")
const Utils = require("../utils/Utils");
const Date = require("../utils/Date");
const { decode } = require("utf8");

const service = {
    name: "user",
    mixins: [DbService],
    adapter: new SqlAdapter('compass', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    }),
    settings: {
        JWT_SECRET: process.env.JWT_SECRET || "DEFAULT_JWT_SECRET",
    },
    model: {
        name: "user",
        define: {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            login: Sequelize.STRING,
            tag: Sequelize.STRING,
            email: {
                type: Sequelize.STRING,
                unique: true
            },
            discord_id: Sequelize.STRING,
            bio: {
                type: Sequelize.STRING,
            },
            password: Sequelize.STRING
        }
    },
    hooks: {
        before: {
            /**
             * Salage du mot de passe envoyé en paramètre
             * 
             * @param {Context} ctx
             */
            async create(ctx) {
				if(!ctx.params.password) {
					ctx.params.password = Utils.salt(ctx.params.clearPassword)
                }
            }
        }
    },
    actions: {
        /**
		 * Authenticate with username & password
		 *
		 * @actions
		 * @param {String} email - User email 
		 * @param {String} password - User password
		 *
		 * @returns {Object} User in context meta, returns a JWT token and expiration time 
		 */
		authenticate: {
			rest: "POST /authenticate",
			params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
			authorization: false,
			async handler(ctx) {
                const { email, password } = ctx.params;
                LOGGER.log(email + " is authenticating...")
                let users = await ctx.call("user.find", { query: {email: email}})
                const user = users ? users[0] : null
                if (!user) throw new MoleculerClientError("Email introuvable", 422, "", [{ field: "email", message: "is not found" }]);
                const res = await Utils.compare(password, user.password)
                if (!res) throw new MoleculerClientError("Mot de passe incorrect", 403, "", [{ field: "password", message: "wrong" }]);
                let expiresIn = "1h"
                let response = {
                    token: jwt.sign({id: user.id}, this.settings.JWT_SECRET, {expiresIn: expiresIn}),
                    expiresIn: expiresIn
                }
                if(this.settings.JWT_SECRET === "DEFAULT_JWT_SECRET") response.warning = "WARNING MISSING JWT IN ENV !!!"
                //Store the token in httpOnly cookie for secure and unreadable token in session
                return response
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
                            LOGGER.error(err)
                            return reject(err);
                        } else {
                            resolve(decoded);
                        }
					});
				});
				if (decoded.id) {
                    const id = decoded.id
                    let users = await ctx.call("user.find", { query: {id}})
                    const user = users ? users[0] : null
                    if(!user) throw new MoleculerClientError("User introuvable", 500, "", []);
                    return user
                }
            }
		},
        /**
		 * Get boolean for user existence, finding by it's discord_id
		 *
		 * @actions
		 * @param {String} discord_id - User's discord_id
		 *
		 * @returns {Object} Object containing data : 'exists' true or false
		 */
        async existsByDiscordId(ctx) {
            return await ctx.call("user.find", {
                query: {
                    discord_id: ctx.params.discord_id ? ctx.params.discord_id : -1 
                }
            }).then((res) => {
                if(res.length >= 1 && res[0].discord_id == ctx.params.discord_id) {
                    return {
                        data: {
                            exists: true
                        }
                    }
                } else {
                    return {
                        data: {
                            exists: false
                        }
                    }
                }
            })
        }
    }
}

module.exports = service