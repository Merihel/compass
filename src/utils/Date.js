const moment = require("moment")
const momentDurationFormatSetup = require("moment-duration-format")
momentDurationFormatSetup(moment)

const DateUtils = {
    compareWithNow(timestamp) {
        const now = new moment(Date.now())
        const differencial = new moment(timestamp)
        return now.diff(differencial, "minutes")
    },
    getUptimeFromMilliseconds(seconds) {
        const formatted = moment.duration.format([
            moment.duration(seconds, "millisecond")
        ], "d [days] hh:mm:ss");
        return formatted
    }
}

module.exports = DateUtils