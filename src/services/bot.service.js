const Discord = require("discord.js")
const {token, pre} = require("../../config.json")
const client = new Discord.Client()

client.once('ready', () => {
    console.log('Ready!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(pre)) return
    console.log("Chat command received !")
    const serverQueue = queue.get(message.guild.id);

    /*
    if (message.content.startsWith(`${pre}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${pre}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${pre}stop`)) {
        stop(message, serverQueue);
        return;
    } else {
        message.channel.send("You need to enter a valid command!");
    }
    */
})
const service = {
    name: "bot",
    actions: {
        start(ctx) {
            client.login(token)
            return true
        },
        stop(ctx) {

        }
    }
}

module.exports = service