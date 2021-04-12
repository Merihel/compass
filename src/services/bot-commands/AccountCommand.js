const AbstractCommand = require("./AbstractCommand")
const Discord = require("discord.js")
const Sequelize = require("sequelize");
const fs = require("fs")
const LG = require("../../utils/Logger")
const Utils = require("../../utils/Utils")
const UTF8 = require("utf8")
const LOGGER = new LG("BOT")

function diff_minutes(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }

class RegisterCommand extends AbstractCommand {

    async onReceiveMessage(message, callService, params = {}) {
        const member = await message.member
        const user = await message.author
        LOGGER.log(message.content)
        fs.writeFileSync("./TEST",message.content)
        let dbUser = null
        switch(message.content.split(" ")[1]) {
            case "bio":
                let bio = message.content.split("!account ")[1].split("bio ")[1]
                if(!bio) {
                    message.react("❌")
                } else {
                    await callService("user.find", {query: {discord_id: member.id}}, async (res) => {
                        if(res) {
                            dbUser = res[0]
                        }
                    }).catch(() => {console.log("Oups, not found....")})
                    //TODO TIME CHECK
                    await callService("user.update", {id: dbUser.id, bio: bio}, (res) => {
                        LOGGER.log("User updated !")
                        const response = new Discord.MessageEmbed()
                                .setColor(this.green)
                                .setTitle('OK!')
                                .setDescription(`Ta bio a bien été mise à jour, ${member}`)
                        message.channel.send(response)
                    }).catch((err) => {
                        LOGGER.error(err)
                        let errMessage = `Désolé ${member}, une erreur est survenue...`
                        if(err.message.includes("Entity not found")) {
                            errMessage = `Introuvable en base de données... Es-tu sûr de t'être bien enregistré ? ${member}`
                        }
                        const response = new Discord.MessageEmbed()
                                .setColor(this.red)
                                .setTitle('Oups!')
                                .setDescription(errMessage)
                        message.channel.send(response)
                    })
                }
                break;
            case "pseudo":
                break;
            default:
                return
        }
    }
}

module.exports = RegisterCommand