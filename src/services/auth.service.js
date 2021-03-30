const Utils = require("../utils/Utils")

const service = {
    name: "auth",
    actions: {
        async authenticate(ctx) {
            const login = ctx.params.login
            return await ctx.call("user.find", {query: {tag: login}}).then(async res => {
                const user = res[0]
                const 
                if(user) {
                    const password = ctx.params.password
                    const match = await Utils.compare(password, user.password)
                    return match
                }
                return await false
            })
            return "ccc"
        },
    }
}

module.exports = service