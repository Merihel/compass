class String {
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    ellipsis(str, maxLength) {
        if(!maxLength || (maxLength != null && str.length <= maxLength)) return str
        return str.slice(0, maxLength) + "…"
    }
}

module.exports = new String()