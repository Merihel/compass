const Discord = require("discord.js")
const {token, pre} = require("../../config.json")
const LG = require("../utils/Logger")
const Utils = require("../utils/Utils")
const LOGGER = new LG("BOT")
const client = new Discord.Client()
let context = null

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
            LOGGER.info("Bot restarted!")
            return true
        },
        async stop(ctx) {
            context = ctx
            await client.destroy()
            LOGGER.info("Bot stopped!")
            return true
        }
    }
}

client.once('ready', () => {
    LOGGER.info("Bot ready !")
});

client.once('reconnecting', () => {
    LOGGER.info("Reconnecting...")
});

client.once('disconnect', () => {
    LOGGER.info("Disconnected !")
});

async function callService(serv, args = null, callback = null) {
    await context.call(serv, args).then(res => {
        LOGGER.log("callService res", res)
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
        //LOGGER.log("Does "+member.displayName+" exists in db ?", res)
        if(!res.data.exists) {
            await dmChannel.send("Hey ! Merci de vouloir t'inscrire au serveur ! Je t'ajoute et te prépare un mot de passe tout frais (pas de panique, tu pourras le modifier plus tard).\nJuste une minute...").catch(error => {
                if(error.code == 50007) {
                    message.channel.send("Oups, on dirait que tu ne peux pas encore recevoir mes MP, revois tes paramètres de confidentialité et retente à nouveau !")
                    return
                } 
            })
            dmChannel.startTyping()
            let clearPassword = Utils.generatePass()
            callService("user.create", {
                login: member.displayName,
                tag: user.tag,
                email: null,
                discord_id: member.id,
                bio: null,
                clearPassword: clearPassword
            }, (res) => {
                LOGGER.log("User registered !")
                dmChannel.stopTyping()
                dmChannel.send("Ton inscription est bien validée ! Voici ton mot de passe provisoire: `" + clearPassword + "`, il te sera demandé de le changer à ta première connexion")
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
    LOGGER.info("Bot command by "+message.member.displayName+ " ("+message.member.id+") => "+message.content)
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
    } else if (message.content.startsWith(`${pre}register`)) {
        await registerUser(message)
    } else if (message.content.startsWith(`${pre}clear`)) {
        //TODO PERMISSION CHECK
        // Clear all messages
        message.channel.bulkDelete(100)
            .then(messages => LOGGER.log(`Bulk delete - Succesfully deleted ${messages.size} messages`))
            .catch(error => {
                LOGGER.error(error)
                message.react("❌")
            });
    } else if(message.content.startsWith(`${pre}connect`)) {
        let member = message.member
        let pass = message.content.split("!connect ")[1]
        if(pass) {
            await callService("user.find", {query: {discord_id: member.id}}, async (res) => {
                if(res) {
                    const user = res[0]
                    await callService("auth.authenticate", {user: user, password: pass}, (res) => {
                        console.log("Good pass ?", res)
                        if(res){
                            message.channel.send(`Connecté !`)
                        } else {
                            message.react("❌")
                        }
                    })
                    
                }
            })
        } else {
            message.react("❌")
        }
        
    } else  {
        //const questionMarkEmoji = client.emojis.find(emoji => emoji.name === "question");
        message.react("❓")
    }
})


module.exports = service