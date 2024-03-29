class Session {
    constructor() {
        this.token = null
    }

    setToken(token) {
        sessionStorage.setItem("token", token)
        this.token = token
    }

    getToken() {
        const token = sessionStorage.getItem('token');
        this.token = token
        return this.token
    }
}

module.exports = new Session()