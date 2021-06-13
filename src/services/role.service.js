const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
//errors
const { MoleculerClientError, EntityNotFoundError } = require("moleculer").Errors;
//---
const LG = require("../utils/Logger")
const LOGGER = new LG("USER")
const Utils = require("../utils/Utils");
const DB = require("../utils/DB");
const Date = require("../utils/Date");
const { decode } = require("utf8");

const service = {
    name: "role",
    mixins: [DbService],
    adapter: DB.getSQLAdapter(),
    settings: {
        JWT_SECRET: process.env.JWT_SECRET || "DEFAULT_JWT_SECRET",
    },
    model: {
        name: "role",
        define: {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: Sequelize.STRING,
            color: Sequelize.STRING,
            discord_id: Sequelize.STRING,
        }
    },
    actions: {
        /**
		 * Get boolean for role existence, finding by it's discord_id
		 *
		 * @actions
		 * @param {String} discord_id - User's discord_id
		 *
		 * @returns {Object} Object containing data : 'exists' true or false
		 */
        async existsByDiscordId(ctx) {
            return await ctx.call("role.find", {
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