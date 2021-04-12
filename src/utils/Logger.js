class Logger {
    constructor(context) {
        this.context = context
    }
    log(message) {
        console.log("\x1b[45m" + "[LOG  " + this.context + "]" + "\x1b[0m" + " " +  message)
    }
    info(message) {
        console.log("\x1b[30m\x1b[42m" + "[INFO " + this.context + "]" + "\x1b[0m" + " " + message)
    }
    error(message) {
        console.log("\x1b[41m" + "[ERR  " + this.context + "]" + "\x1b[0m" + " " + message)
    }
    warning(message) {
        console.log("\x1b[30m\x1b[43m" + "[WARN " + this.context + "]" + "\x1b[0m" + " " +  message)
    }
}

module.exports = Logger