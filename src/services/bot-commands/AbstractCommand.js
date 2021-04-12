
const config = require("../../../config.json")

class AbstractCommand {
    constructor() {
        this.red = "#ff0000"
        this.green = "#00d619"
        this.default = "#FFFF3F"
        this.compass = "#e98100"
        this.config = config
    }

    async onReceiveMessage(message, callService, params = {}) {
        console.error("You did not implemented 'onReceiveMessage' !")
        this.message = message
        //replace this method in your commands files
        return
    }
}

module.exports = AbstractCommand