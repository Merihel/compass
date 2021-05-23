const Discord = require("discord.js")
const {pre, guildId, commandsOnlyInSpecificChannel, commandChannel} = require("../../config.json")
const LG = require("../utils/Logger")
const Utils = require("../utils/Utils")
const DateUtil = require("../utils/Date")
const RoleManager = require("../utils/RoleManager")
const Antispam = require("../utils/Antispam")
const LOGGER = new LG("BOT")
const client = new Discord.Client()
//ALL BOT COMMANDS
const MathCommand = require("./bot/MathCommand")
const RegisterCommand = require("./bot/RegisterCommand")
const AccountCommand = require("./bot/AccountCommand")
//Bot controllers
const RulesController = require("./bot/RulesController")

let context = null


const service = {
    name: "bot",
    actions: {
        async start(ctx) {
            context = ctx
            await client.login(process.env.BOT_TOKEN)
            return true
        },
        async restart(ctx) {
            context = ctx
            await client.destroy()
            await client.login(process.env.BOT_TOKEN)
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

/*
* @deprecated 
*/
function checkReactionsFromRulesServer() {
    client.guilds.fetch(guildId).then(guild => {
        client.channels.fetch(guild.rulesChannelID).then(rulesChannel => {
            rulesChannel.messages.fetch(rulesChannel.lastMessageID).then(message => {
                if(message) {
                    console.log("Successfully loaded rules's channel message")
                    let flagContains = false
                    message.reactions.removeAll().then(() => {
                        message.reactions.cache.forEach(it => {
                            if(it._emoji.name == "👍") flagContains = true
                        })
                    })
                   
                    if(!flagContains) {
                        message.react('👍')
                    }
                }
            }).catch(e => {
                LOGGER.error("Couldn't fetch rules's channel message. Rules validation will not work !" + e)
            })
        }).catch(e => {
            LOGGER.error("Couldn't get rules channel: " + e)
        })
    }).catch(e => {
        LOGGER.error("Error couldn't fetch Guild ! Is guildId present in config file ? " + e)
    })
}

client.on('messageReactionAdd', async (reaction, user) => {
	/*
    if(reaction.message.channel.id == reaction.message.guild.rulesChannelID) {
        const controller = new RulesController()
        controller.onRuleMessageReaction(reaction, user)
    } else {
        console.log("Reaction collected, not in rules channel")
    }
    
    
    console.log(reaction.message.channel.id == reaction.message.channel.guild.rulesChannelID)
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    */
});

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
        //LOGGER.log("callService res", res)
        return callback ? callback(res) : res
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

updateUser = async (message) => {
    let dbUser = null 
    let doUpdate = false
    const member = await message.member
    const user = await message.author
    await callService("user.find", {query: {discord_id: member.id}}, async (res) => {
        if(res) {
            if(DateUtil.compareWithNow(res[0].updatedAt) > 30) {
                doUpdate = true
                dbUser = res[0]
            } else {
                LOGGER.log("Not updating user since last update is from less than 1 minute")
            }
        }
    }).catch((e) => {LOGGER.error(e)})
    if(dbUser && doUpdate) {
        await callService("user.update", {id: dbUser.id, login: member.displayName, tag:user.tag, updatedAt: Date.now()}, async (res) => {
            if(res) {
                LOGGER.log("Updated user "+member.id)
            }
        }).catch(e => {
            LOGGER.error(e)
        }) 
    }
}

punishSpam = (message, member) => {
    const role = RoleManager.getMutedRole(member.guild)
    if(role) {
        message.guild.members.cache.get(message.author.id).roles.add(role);
        message.channel.send(member.displayName+", tu as été mute à cause du spam. Contacte un membre du Staff 😉")
        Antispam.deleteSpamRegistering(member.id)
    } else {
        LOGGER.error("LE ROLE MUTED N'A PAS ETE TROUVE DANS LA CONFIGURATION")
    }
}

notCommand = (message) => { //yeah this is an easter egg for my friend Moon... also an antispam and anti Discord link
    const member = message.member
    const memberTopRole = RoleManager.getHighestRoleFromDiscordMember(member)

    if(Utils.isDiscordLink(message.content)) {
        const checkedRole = RoleManager.checkRole(memberTopRole.id, 3)
        if(roleChecker(message, checkedRole, false)) {
            return
        } else {
            message.channel.send(`Les liens Discord sont interdits ${member.displayName}`)
            message.delete({timeout: 100});
        }
    }
    if (message.content.includes("feur") || message.content.includes("Feur")) {
        message.channel.messages.fetch({limit: 2})
        .then(messageMappings => {
            let messages = Array.from(messageMappings.values());
            let previousMessage = messages[1];
            if(previousMessage.content.endsWith("uoi") || previousMessage.content.endsWith("uoi ?") || previousMessage.content.endsWith("uoi?")) {
                message.channel.send(`Oh il t'as détruit ! :joy:`)
            }
        })
        .catch(error => Logger.error("error", "Error fetching messages in channel"))
    }
}

roleChecker = (message, checkedRole, isCommand = true) => {
    if(checkedRole.result) {
        return true
    } else {
        isCommand && message.react("⛔")
        return false
    }
}

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(pre)) {
        if(!message.author.bot) {
            //todo antispam for "everyone" role ! (antilink)
            const member = message.member
            const memberTopRole = RoleManager.getHighestRoleFromDiscordMember(member)
            if(memberTopRole.id === guildId) {
                if(Antispam.checkForLinks(message)) {
                    message.delete({timeout:100})
                }
            }
            const checkedRole = RoleManager.checkRole(memberTopRole.id, 3)
            if(!roleChecker(message, checkedRole, false)) {
                if(Antispam.checkForSpam(message.content, message.member.id)) {
                    punishSpam(message, message.member)
                }
            }
        }
        notCommand(message)
        return
    }
    if(commandsOnlyInSpecificChannel) {
        if(message.channel.id !== commandChannel) {
            return
        }
    }

    updateUser(message)

    const memberTopRole = RoleManager.getHighestRoleFromDiscordMember(message.member)
    LOGGER.info("Bot command by "+message.member.displayName+ " ("+message.member.id+" with role '"+memberTopRole.name+"') => "+message.content)

    if (message.content.startsWith(`${pre}math`)) {
        const checkedRole = RoleManager.checkRole(memberTopRole.id, 3)
        if(!roleChecker(message, checkedRole)) return
        const mathCommand = new MathCommand()
        mathCommand.onReceiveMessage(message, (serv, args, callback) => callService(serv, args, callback))
    } else if (message.content.startsWith(`${pre}register`)) {
        const checkedRole = RoleManager.checkRole(memberTopRole.id, 1)
        if(!roleChecker(message, checkedRole)) return
        const registerCommand = new RegisterCommand()
        await registerCommand.onReceiveMessage(message, (serv, args, callback) => callService(serv, args, callback))
    } else if (message.content.startsWith(`${pre}account`)) {
        const checkedRole = RoleManager.checkRole(memberTopRole.id, 1)
        if(!roleChecker(message, checkedRole)) return
        const accountCommand = new AccountCommand()
        await accountCommand.onReceiveMessage(message, (serv, args, callback) => callService(serv, args, callback))
    } else if (message.content.startsWith(`${pre}clear`) || message.content.startsWith(`${pre}clean`)) {
        const checkedRole = RoleManager.checkRole(memberTopRole.id, 3)
        if(!roleChecker(message, checkedRole)) return
        // Clear all messages
        message.channel.bulkDelete(100)
            .then(messages => LOGGER.log(`Bulk delete - Succesfully deleted ${messages.size} messages`))
            .catch(error => {
                LOGGER.error(error)
                message.react("❌")
            });
    } else {
        message.react("❓")
    } /*else if(message.content.startsWith(`${pre}connect`)) {
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
        
    }*/ 
})


module.exports = service