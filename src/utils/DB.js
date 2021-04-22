const SqlAdapter = require("moleculer-db-adapter-sequelize");

const DBUtils = {
    getSQLAdapter() {
        return new SqlAdapter(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        })
    }
}

module.exports = DBUtils