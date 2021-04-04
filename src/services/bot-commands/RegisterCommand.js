const AbstractCommand = require("./AbstractCommand")
const LG = require("../../utils/Logger")
const Utils = require("../../utils/Utils")
const LOGGER = new LG("BOT")

class RegisterCommand extends AbstractCommand {

    async onReceiveMessage(message, callService, params = {}) {
        const member = await message.member
        const user = await message.author
        const dmChannel = await member.createDM()
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


                // STOP 
                // ASK FIRST FOR EMAIL, THEN CREATE USER, AND SEND PASSWORD + AUTH LINK BY EMAIL !!!
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
                            console.log("ORIGINAL USER ID", user.id)
                            console.log("REACTER ID",reacter.id)
                            console.log("MESSAGE AUTHOR ID",asker.author.id)
                            return ['👍', '👎'].includes(reaction.emoji.name) && reacter.id != asker.author.id;
                        };
                        //TODO
                        await asker.awaitReactions(validationFilter, { max: 1, time: 120000, errors: ['time'] })
                            .then(async collected => {
                                const reaction = await collected.first();
                                if (reaction.emoji.name === '👍') {
                                    let clearPassword = Utils.generatePass()
                                    LOGGER.log("Clear password for user: " + clearPassword)
                                    
                                    callService("user.create", {
                                        login: member.displayName,
                                        tag: user.tag,
                                        email: email,
                                        discord_id: member.id,
                                        bio: null,
                                        clearPassword: clearPassword
                                    }, (res) => {
                                        LOGGER.log("User registered !")
                                        dmChannel.stopTyping()
                                        const response = Utils.messageEmbedBuilder({
                                            title: "👍 OK !",
                                            color: this.green,
                                            description: "Ton inscription a bien été validée ! Un email vient d'être envoyé à `" + email + "` avec un lien de connexion :clap: :clap: :clap:"
                                        })
                                        dmChannel.send(response)
                                    })

                                    //TODO !!!!!!
                                    //SEND EMAIL WITH NODEMAIL
                                    

                                } else {
                                    const response = Utils.messageEmbedBuilder({
                                        title: "❌ Oups !",
                                        color: this.red,
                                        description: "Retente ta chance amigo :wink:"
                                    })
                                    dmChannel.send(response)
                                }
                            })
                            .catch(collected => {
                                const response = Utils.messageEmbedBuilder({
                                    title: "❌ Mais !",
                                    color: this.red,
                                    description: "Pas bien de pas suivre les règles... Pour la peine tu vas tout recommencer !"
                                })
                                dmChannel.send(response)
                            });
                    } catch (e) {
                        dmChannel.stopTyping()
                        LOGGER.error(e)
                        const response = Utils.errorEmbedBuilder(e)
                        dmChannel.send(response)
                    }

                })
                .catch(collected => {
                    LOGGER.warning("Wrong email entered: " + collected)
                    dmChannel.stopTyping()
                    const response = Utils.messageEmbedBuilder({
                        title: "❌ Oups !",
                        color: this.red,
                        description: "Ou bien ton email n'est pas valide, ou bien tu n'as pas été assez rapide ! Retente ta chance amigo :wink:"
                    })
                    dmChannel.send(response)
                })
            } else {
                const response = Utils.messageEmbedBuilder({
                    title: "❌ Oups !",
                    color: this.red,
                    description: `Tu existes déjà dans notre base de données, ${member}`
                })
                message.channel.send(response)
            }
        })
    }
}

module.exports = RegisterCommand