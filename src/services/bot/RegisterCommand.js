const AbstractCommand = require("./AbstractCommand")
const LG = require("../../utils/Logger")
const LOGGER = new LG("BOT")
const Utils = require("../../utils/Utils")
const Mail = require("../../utils/Mail")
const RoleManager = require("../../utils/RoleManager")

class RegisterCommand extends AbstractCommand {

    async onReceiveMessage(message, callService, params = {}) {
        const member = await message.member
        const user = await message.author
        const dmChannel = await member.createDM()
        const memberTopRole = RoleManager.getHighestRoleFromDiscordMember(member)
        let dbRole = null
        if(memberTopRole.id) {
            await callService("role.existsByDiscordId", {
                discord_id: memberTopRole.id
            }, async (res) => {
                console.log("does exists", res)
                try {
                    if(!res.data.exists) {
                        dbRole = await callService("role.create", {
                            name:memberTopRole.name,
                            color:memberTopRole.color,
                            discord_id:memberTopRole.id
                        })
                    } else {
                        const role = await callService("role.find", {query: {discord_id: memberTopRole.id}})
                        console.log("ROLE ????", role)
                    }
                } catch(e) {
                    LOGGER.error(e)
                }
            }, (error) => {
                LOGGER.error(error)
            })
        } else {
            LOGGER.warning("Can't get top role for registering user ! His current top role will not be affected to his DB entry in 'Users'")
        }
        console.log("DB ROLE ???", dbRole)
        callService("user.existsByDiscordId", {
            discord_id: member.id
        }, async (res) => {
            //LOGGER.log("Does "+member.displayName+" exists in db ?", res)
            if (!res.data.exists) {
                const message = Utils.messageEmbedBuilder({
                    color: this.default,
                    title: "👋 Hey !",
                    description: "Merci de vouloir t'inscrire au serveur !\nDernière étape : tu vas recevoir ton mot de passe provisoire par email.\nQuelle est ton adresse email ?"
                })
                await dmChannel.send(message).catch(error => {
                    if (error.code == 50007) {
                        const response = Utils.messageEmbedBuilder({
                            color: this.red,
                            title: "❌ Oups !",
                            description: "On dirait que tu ne peux pas recevoir mes MP, revois tes paramètres de confidentialité et retente à nouveau"
                        })
                        channel.send(response)
                        return
                    }
                })
                const mailFilter = m => Utils.validateEmail(m.content);
                dmChannel.awaitMessages(mailFilter, { max: 1, time: 120000, errors: ['time'] })
                .then(async collected => {
                    try {
                        dmChannel.startTyping()
                        let email = null
                        collected.map(it => {
                            email = it.content
                        })
                        const validation = Utils.messageEmbedBuilder({
                            color: this.default,
                            title: "Sûr ?!",
                            description: "Tu as entré `" + email + "`\nEs-tu bien sûr de cet email ?"
                        })
                        const asker = await dmChannel.send(validation)
                        asker.react("👍").then(() => {
                            asker.react("👎")
                        })
                        const validationFilter = (reaction, reacter) => {
                            return ['👍', '👎'].includes(reaction.emoji.name) && reacter.id != asker.author.id;
                        };
                        await asker.awaitReactions(validationFilter, { max: 1, time: 120000, errors: ['time'] })
                        .then(async collected => {
                            const reaction = await collected.first();
                            if (reaction.emoji.name === '👍') {
                                let clearPassword = Utils.generatePass()
                                LOGGER.log("Clear password for user: " + clearPassword)
                                const resetToken = Utils.createResetToken()
                                callService("user.create", {
                                    login: member.displayName,
                                    tag: user.tag,
                                    email: email,
                                    discord_id: member.id,
                                    avatar: user.displayAvatarURL({dynamic: true}),
                                    bio: null,
                                    clearPassword: clearPassword,
                                    top_role: dbRole ? dbRole.id : null,
                                    reset_pass: resetToken
                                }, async (res) => {
                                    LOGGER.log("User registered !")
                                    await callService("user.authenticate", {email: email, password: clearPassword}, async (auth) => {
                                        const secure = process.env.SECURE ? "https://" : "http://"
                                        const link = secure + process.env.HOST+":"+process.env.PORT+"/reset-password/"+encodeURI(resetToken)
                                        const mailSent = await Mail.send({
                                            from: '"'+this.config.guildName+'" <'+process.env.MAIL_ID+'>', // sender address
                                            to: email, // list of receivers
                                            subject: "Ton inscription à Compass 🧭 via "+this.config.guildName,
                                        }, member.displayName, this.config.guildName, link)
                                        if(mailSent === true) {
                                            const response = Utils.messageEmbedBuilder({
                                                title: "👍 OK !",
                                                color: this.green,
                                                description: "Ton inscription a bien été validée ! Un email vient d'être envoyé à `" + email + "` avec un lien de connexion :clap: :clap: :clap:"   
                                            })
                                            dmChannel.send(response)
                                            LOGGER.log("End of register command: Valid register")
                                        } else {
                                            LOGGER.error(mailSent)
                                            const response = Utils.errorEmbedBuilder(mailSent)
                                            dmChannel.send(response)
                                            LOGGER.log("End of register command: Error on mailSent")
                                        }
                                        dmChannel.stopTyping()
                                    }).catch(e => {
                                        dmChannel.stopTyping()
                                        LOGGER.error("ERROR", e)
                                        const response = Utils.errorEmbedBuilder(e)
                                        dmChannel.send(response)
                                        LOGGER.log("End of register command: error catching user.authenticate")
                                    })
                                }).catch(e => {
                                    dmChannel.stopTyping()
                                    LOGGER.error(e)
                                    const response = Utils.errorEmbedBuilder(e)
                                    dmChannel.send(response)
                                    LOGGER.log("End of register command: error catching user.create")
                                })
                            } else {
                                const response = Utils.messageEmbedBuilder({
                                    title: "❌ Oups !",
                                    color: this.red,
                                    description: "Une erreur est survenue... Retente ta chance avec la commande !register :wink:"
                                })
                                LOGGER.log("End of register command: user responded with thumbs down emoji")
                                dmChannel.send(response)
                            }
                        })
                        .catch(collected => {
                            console.log(collected)
                            const response = Utils.messageEmbedBuilder({
                                title: "❌ Oups !",
                                color: this.red,
                                description: "Retente ta chance :wink:"
                            })
                            dmChannel.send(response)
                            LOGGER.log("End of register command: error collecting validation reactions emojis")

                        });
                        dmChannel.stopTyping()
                    } catch (e) {
                        dmChannel.stopTyping()
                        LOGGER.error(e)
                        const response = Utils.errorEmbedBuilder(e)
                        dmChannel.send(response)
                        LOGGER.log("End of register command: Generic try catch")
                    }
                })
                .catch(collected => {
                    LOGGER.warning("Wrong email entered: " + collected)
                    dmChannel.stopTyping()
                    const response = Utils.messageEmbedBuilder({
                        title: "❌ Oups !",
                        color: this.red,
                        description: "Ou bien ton email n'est pas valide, ou bien tu n'as pas été assez rapide ! Retente ta chance :wink:"
                    })
                    dmChannel.send(response)
                    LOGGER.log("End of register command: wrong email entered")
                })
            } else {
                const response = Utils.messageEmbedBuilder({
                    title: "❌ Oups !",
                    color: this.red,
                    description: `Tu existes déjà dans notre base de données, ${member}`
                })
                message.channel.send(response)
                LOGGER.log("End of register command: User already exists in database")
            }
        })
    }
}

module.exports = RegisterCommand