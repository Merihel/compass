const Discord = require("discord.js")
const {token, pre} = require("../../config.json")
const client = new Discord.Client()
let context = null

client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

function callService(serv, args = null, callback = null) {
    context.call(serv, args).then(res => {
        return callback ? callback(res) : res
    })
}

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(pre)) return
    //console.log("Chat command received !")
    //const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${pre}play`)) {
        //execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${pre}skip`)) {
        //skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${pre}stop`)) {
        //stop(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${pre}math`)) {
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
        } else {
            message.channel.send("Invalid operation");
        }
    } else {
        message.channel.send("You need to enter a valid command!");
    }
})
const service = {
    name: "bot",
    actions: {
        async start(ctx) {
            context = ctx
            await client.login(token)
            return true
        },
        async restart(ctx) {
            context = ctx
            await client.destroy()
            await client.login(token)
            console.log("Bot restarted !")
            return true
        },
        async stop(ctx) {
            context = ctx
            await client.destroy()
            console.log("Bot stopped !")
            return true
        }
    }
}

module.exports = service