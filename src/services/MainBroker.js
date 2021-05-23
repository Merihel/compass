require('dotenv').config()
const { ServiceBroker } = require("moleculer");
const LG = require("../utils/Logger")
const LOGGER = new LG("MB")
const BrokerService = require("./broker.service")
const AuthService = require("./auth.service")
const MathService = require("./math.service")
const BotService = require("./bot.service")
const UserService = require("./user.service")
const ApiService = require("./api.service");

// Create a ServiceBroker
const MainBroker = new ServiceBroker({
    nodeID: "compass-1",
    hotReload: process.env.NODE_ENV == "development" ? true : false,
    logger: true, // the `true` is same as `console`
    logLevel: "warn", // only logs the 'warn' & 'error' entries to the console

})

//Service call
MainBroker.createService(BrokerService)
MainBroker.createService(AuthService)
MainBroker.createService(MathService)
MainBroker.createService(BotService)
MainBroker.createService(UserService)
MainBroker.createService(ApiService)

// Start the broker
MainBroker.start()
    .then(res => {
        //console.log("env", process.env.NODE_ENV)
        MainBroker.call("bot.start") //Waking up Discord bot
    })
    .catch(err => {
        LOGGER.error(`Error occured!`);
        LOGGER.error(err.stack)
    });