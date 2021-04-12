require('dotenv').config()
const { ServiceBroker } = require("moleculer");
const BrokerService = require("./broker.service")
const AuthService = require("./auth.service")
const MathService = require("./math.service")
const BotService = require("./bot.service")
const UserService = require("./user.service")
const ApiService = require("./api.service")

// Create a ServiceBroker
const MainBroker = new ServiceBroker({
    nodeID: "server-1",
    hotReload: true,
    logger: {
        type: "Console",
        options: {
            formatter: "simple"
        }
    }
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
		//What to do when the broker started ?
        MainBroker.call("bot.start") //Waking up Discord bot
    })
    .catch(err => console.error(`Error occured! ${err.message}`));