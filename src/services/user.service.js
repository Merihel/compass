const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
//
const LG = require("../utils/Logger")
const LOGGER = new LG("USER")
const Utils = require("../utils/Utils")

const service = {
    name: "user",
    mixins: [DbService],
    adapter: new SqlAdapter('compass', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
    }),
    settings: {
        JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
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
            email: Sequelize.STRING,
            discord_id: Sequelize.STRING,
            bio: Sequelize.TEXT,
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
                LOGGER.log("create => password hash")
				if(!ctx.params.password) {
					ctx.params.password = Utils.salt(ctx.params.clearPassword)
                }
            }
        }
    },
    actions: {
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
                LOGGER.log("HEYYYYYY", ctx.params.token)
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
        async existsByDiscordId(ctx) {
            return await ctx.call("user.find", {
                query: {
                    discord_id: ctx.params.discord_id ? ctx.params.discord_id : -1 
                }
            }).then((res) => {
                LOGGER.log(res)
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