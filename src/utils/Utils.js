const bcrypt = require("bcrypt")
const Discord = require("discord.js")

const utils = {
    salt(password) {
        let toHash = password
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(toHash, salt)
        return hash
    },
    async compare(password, hash) {
        return await bcrypt.compare(password, hash)
    },
    generatePass() {
        var length = 12,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/%.",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    },
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    messageEmbedBuilder(params) {
        return new Discord.MessageEmbed(params)
    },
    errorEmbedBuilder(error, errorMessage = "Une erreur est survenue. Tu peux copier l'erreur pour en informer un Modérateur.") {
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle("Désolé, mais...")
            .setColor("#ff0000")
            .setDescription(errorMessage)
            .addFields(
                { name: 'Erreur', value: error }
            )
        return errorEmbed
    },
    isDiscordLink(str) {
        const regex = new RegExp("(discord.gg\/[A-z0-9]*)", 'g')
        return regex.test(str)
    },
    sanitizeSensitive(object) {
        const list = ["password"]
        list.forEach(field => {
            delete object[field]
        });
        return object
    }

}

module.exports = utils