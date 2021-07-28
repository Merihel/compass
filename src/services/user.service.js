const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
//errors
const { MoleculerError } = require("moleculer").Errors;
//---
const LG = require("../utils/Logger")
const LOGGER = new LG("USER")
const Utils = require("../utils/Utils");
const DB = require("../utils/DB");
const Date = require("../utils/Date");
const { decode } = require("utf8");

const service = {
    name: "user",
    mixins: [DbService],
    adapter: DB.getSQLAdapter(),
    settings: {
        JWT_SECRET: "DEFAULT_JWT_SECRET",
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
            avatar: Sequelize.STRING,
            bio: {
                type: Sequelize.STRING,
            },
            password: Sequelize.STRING,
            top_role: Sequelize.INTEGER,
            reset_pass: Sequelize.STRING
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
        },
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
            authorization: false,
			params: {
                email: { type: "email" },
                password: { type: "string", min: 1 }
			},
			async handler(ctx) {
                const { email, password } = ctx.params;
                LOGGER.log(email + " is authenticating...")
                let users = await ctx.call("user.find", { query: {email: email}})
                const user = users ? users[0] : null
                if (!user) throw new MoleculerError("Email introuvable", 422, "", [{ field: "email", message: "is not found" }]);
                const res = await Utils.compare(password, user.password)
                if (!res) throw new MoleculerError("Mot de passe incorrect", 403, "", [{ field: "password", message: "wrong" }]);
                let expiresIn = "72h"
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
            rest: "GET /getByToken",
            authorization: true,
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
                    const user = await ctx.call("user.get", { id: id, doPopulate: true })
                    if(!user) throw new MoleculerError("Utilisateur introuvable", 500, "", []);
                    return Utils.sanitizeSensitive(user)
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
        },
        /**
		 * Get user from email
		 *
		 * @actions
		 * @param {String} email - User's email
		 *
		 * @returns {Object} Object containing user data
		 */
        getByEmail: {
            rest: "GET /getByEmail",
            authorization: true,
			params: {
                email: { type: "email" },
			},
            async handler(ctx) {
                return await ctx.call("user.find", {
                    query: {
                        email: ctx.params.email ? ctx.params.email : "" 
                    }
                }).then((res) => {
                    if(res.length == 1) {
                        const user = res[0]
                        delete user.password
                        return user
                    } else if(res.length > 1) {
                        throw new MoleculerError("Plusieurs utilisateurs trouvés avec ce mail", 500, "", [])
                    } else {
                        LOGGER.error("Une erreur est survenue lors de la requête: "+res, 500, "", [])
                        throw new MoleculerError()
                    }
                })
            }
        },
        /**
		 * Get user from reset_password token
		 *
		 * @actions
		 * @param {String} token - User reset_password token
		 *
		 * @returns {Object} Object containing user data
		 */
         getByResetPassword: {
            rest: "GET /getByResetPasswordToken",
            authorization: false,
			params: {
                token: { type: "string" },
			},
            async handler(ctx) {
                return await ctx.call("user.find", {
                    query: {
                        reset_pass: ctx.params.token ? ctx.params.token : "" 
                    }
                }).then((res) => {
                    if(res.length == 1) {
                        const user = res[0]
                        delete user.password
                        return user
                    } else if(res.length > 1) {
                        throw new MoleculerError("Plusieurs utilisateurs trouvés avec ce token reset_pass", 500, "", [])
                    } else {
                        throw new MoleculerError("Mauvais traitement de la réponse. Res: "+res, 500, "", [])
                    }
                })
            }
        },
        async get(ctx) {
            if(ctx.params.doPopulate) {
                const user = await ctx.call("user.find", { query: {id:ctx.params.id}})
                const userRoleId = user[0].top_role
                user[0].top_role = await ctx.call("role.get", { id: userRoleId })
                return user[0]
            } else {
                const user = await ctx.call("user.find", { query: {id:ctx.params.id}})
                return user
            }
        },
        /**
		 * Update user's password
		 *
		 * @actions
		 * @param {String} reset_token - User reset_password token
		 * @param {String} salt - User salted password
		 *
		 * @returns {Object} Object containing user data
		 */
        updatePassword: {
            rest: "post /updatePassword",
            authorization: false,
			params: {
                reset_token: { type: "string" },
                password: { type: "string" },
			},
            async handler(ctx) {
                const user = await ctx.call("user.getByResetPassword", {token: ctx.params.reset_token})
                if(user) {
                    user.password = Utils.salt(ctx.params.password)
                    user.reset_pass = null
                    const newUser = await this.adapter.updateById(user.id, {"$set": user})
                    newUser.password = undefined
                    return newUser
                } else {
                    throw new MoleculerError("Utilisateur introuvable lors de la mise à jour du mot de passe. Res: "+res, 500, "", [])
                }
            }
        }
    }
}

module.exports = service