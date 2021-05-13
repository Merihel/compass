class Antispam {
    constructor() {
        this.spamStrings = {}
        this.spamAttempts = {}
    }

    registerMessage(str, memberId) {
        if(this.spamStrings[memberId] !== str) this.spamStrings[memberId] = str
    }

    checkForSpam(str, memberId) {
        if(str === this.spamStrings[memberId] && this.spamAttempts[memberId] >= 2) {
            return true
        } else if(str === this.spamStrings[memberId]) {
            this.spamAttempts[memberId] += 1
            return false
        } else {
            this.spamStrings[memberId] = str
            this.spamAttempts[memberId] = 1
            return false
        }
    }

    checkForLinks(message) {
        const regex = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)
        return regex.test(message.content)
    }

    deleteSpamRegistering(memberId) {
        delete this.spamStrings[memberId]
        delete this.spamAttempts[memberId]
    }
}

module.exports = new Antispam()