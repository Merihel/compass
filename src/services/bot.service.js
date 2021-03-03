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

async function callService(serv, args = null, callback = null) {
    await context.call(serv, args).then(res => {
        return callback ? callback(res) : res
    })
}

async function registerUser(message) {
    const member = await message.member
    const user = await message.author
    const dmChannel = await member.createDM()
    callService("user.existsByDiscordId", {
        discord_id: member.id
    }, async (res) => {
        console.log("Does "+member.displayName+" exists in db ?", res)
        if(!res.data.exists) {
            await dmChannel.send("Hey ! Merci de vouloir t'inscrire au serveur ! Je t'ajoute et te prépare un mot de passe tout frais (pas de panique, tu pourras le modifier plus tard).\nJuste une minute...").catch(error => {
                if(error.code == 50007) {
                    message.channel.send("Oups, on dirait que tu ne peux pas encore recevoir mes MP, revois tes paramètres de confidentialité et retente à nouveau !")
                    return
                } 
            })
            dmChannel.startTyping()
            callService("user.create", {
                login: member.displayName,
                tag: user.tag,
                email: null,
                discord_id: member.id,
                bio: null
            }, (res) => {
                dmChannel.stopTyping()
                dmChannel.send("Bien inscrit !")
            })
        } else {
            message.channel.send(`Tu existes déjà dans notre base de données, ${member}`)
        }
    })
}

// Create an event listener for new guild members
client.on('guildMemberAdd',async member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'coucou');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    //PM to the user !
    // Send the message, mentioning the member
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(pre)) return
    //console.log("Chat command received !")
    //const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${pre}math`)) {
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
    } else if (message.content.startsWith(`${pre}register`)) {
        await registerUser(message)
    } else if (message.content.startsWith(`${pre}clear`)) {
        //TODO PERMISSION CHECK
        // Clear all messages
        message.channel.bulkDelete(100)
            .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
            .catch(error => {
                console.error(error)
                message.react("❌")
            });
    } else {
        //const questionMarkEmoji = client.emojis.find(emoji => emoji.name === "question");
        message.react("❓")
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