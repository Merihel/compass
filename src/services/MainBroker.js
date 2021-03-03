const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");

const MathService = require("./math.service")
const BotService = require("./bot.service")
const UserService = require("./user.service")
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
MainBroker.createService(MathService)
MainBroker.createService(BotService)
MainBroker.createService(UserService)

MainBroker.createService({
    mixins: [ApiService],
    settings: {
        routes: [{
            path: "/api",
            /*
            whitelist: [
                // Access any actions in 'posts' service
                "posts.*",
                // Access call only the `users.list` action
                "math.add",
                // Access any actions in 'math' service
                /^math\.\w+$/,
                // Access any actions in 'math' service
                /^bot\.\w+$/
            ],
            aliases: {
                // Call `auth.login` action with `GET /login` or `POST /login`
                "add": "math.add",
                // Restrict the request method
                "POST substract": "math.substract",
                // The `name` comes from named param. 
                // You can access it with `ctx.params.name` in action
                "GET math/:idinfo": "math.info",
            }*/
        }]
    }
})


// Start the broker
MainBroker.start()
    .then(res => {
        MainBroker.call("bot.start")
    })
    .catch(err => console.error(`Error occured! ${err.message}`));