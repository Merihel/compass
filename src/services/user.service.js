const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
// Create a Mongoose service for `post` entities
const service = {
    name: "user",
    mixins: [DbService],
    adapter: new SqlAdapter('compass', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
    }),
    model: {
        name: "user",
        define: {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            login: Sequelize.STRING,
            discord_id: Sequelize.STRING,
            bio: Sequelize.TEXT
        },
        options: {
            // Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
        }
    },
    actions: {
        async add(ctx) {
            ctx.call("user.create", {
                login: "test1",
                discord_id:"aajdnbdighi455",
                bio: "COUCOU C MOI"
            }).then(res => {
                return res 
            })
        }
    }
}

module.exports = service