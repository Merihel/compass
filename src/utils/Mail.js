const nodemailer = require("nodemailer")
const LG = require("./Logger")
const LOGGER = new LG("U-MAIL")
const fs = require("fs")

const mail = {
    async prepareTemplate(params) {
        const regex = /\\/gm;
        let path = (process.cwd()+'\\src\\assets\\mail-template.html');
        path = path.replace(regex, "/")
        const data = fs.readFileSync(path,"utf8") 
        if(!data) throw new Error("Can't read file ! Data is null")
        let template = data
        if(params && params.link && params.userName && params.guildName) {
            let finalTemplate = template.replace("%LINK%", params.link).replace("%USER_NAME%", params.userName).replace("%SERVER_NAME%", params.guildName)
            let text = "Salut "+params.userName+" ! Merci pour ton inscription à Compass via le serveur de "+params.guildName+". Suis ce lien pour finaliser ton inscription et le modifier: "+params.link+".\nA bientôt sur "+params.guildName+" !" // plain text body
            return await {
                html: finalTemplate,
                text: text
            }
        }
        return await null
    },
    async send(params = {}, userName = "", guildName = "", link = "") {
        //Test account only available in debug mode
        try {
            let testAccount = await nodemailer.createTestAccount()
            let transporter = await nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.MAIL_ID,
                    pass: process.env.MAIL_PASS,
                }
            })
            let template = await this.prepareTemplate({
                link: link,
                guildName: guildName,
                userName: userName
            }).catch(e => {
                throw new Error("Can't prepare template - "+e)
            }) 
            let lastParams = Object.assign(params, template)
            // send mail with defined transport object
            let info = await transporter.sendMail(lastParams)
            LOGGER.log("Email sent: "+ info.messageId)
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            return true
        } catch(e) {
            LOGGER.error("Can't send email: "+e)
            return e
        }
    }
}

module.exports = mail