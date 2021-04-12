const Moment = require("moment")

const DateUtils = {
    compareWithNow(timestamp) {
        const now = new Moment(Date.now())
        const differencial = new Moment(timestamp)
        return now.diff(differencial, "minutes")
    }
}

module.exports = DateUtils