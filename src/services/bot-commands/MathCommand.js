const AbstractCommand = require("./AbstractCommand")

class MathCommand extends AbstractCommand {

    async onReceiveMessage(message, callService, params = {}) {
        const msg = message.content
        let a,b = null
        if(msg.includes("+")) {
            a = msg.split("!math")[1].split("+")[0]
            b = msg.split("!math")[1].split("+")[1]
            callService("math.add", {a:a,b:b}, (res) => {
                if(isNaN(res)) {
                    message.channel.send("Only one operator is supported");
                } else {
                    message.channel.send(res);
                }
            })
            
        } else if (msg.includes("-")) {
            a = msg.split("!math")[1].split("-")[0]
            b = msg.split("!math")[1].split("-")[1]
            callService("math.substract", {a:a,b:b}, (res) => {
                if(isNaN(res)) {
                    message.channel.send("Only one operator is supported");
                } else {
                    message.channel.send(res);
                }
            })
        } else if (msg.includes("/")) {
            a = msg.split("!math")[1].split("/")[0]
            b = msg.split("!math")[1].split("/")[1]
            callService("math.divide", {a:a,b:b}, (res) => {
                if(isNaN(res)) {
                    message.channel.send("Only one operator is supported");
                } else {
                    message.channel.send(res);
                }
            })
        } else {
            message.channel.send("Invalid operation");
        }
    }
}

module.exports = MathCommand