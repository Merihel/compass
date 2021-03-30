const bcrypt = require("bcrypt")

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
    }
}

module.exports = utils