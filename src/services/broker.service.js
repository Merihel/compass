
const { exec } = require('child_process');
const { env } = require('process');
const LG = require("../utils/Logger")
const LOGGER = new LG("API")

const service = {
    name: "broker",
    actions: {
        async info(ctx) {
            const health = await ctx.broker.getHealthStatus()
            return health
        },
        restart: {
			rest: "GET /restart",
            authorization: false,
			async handler(ctx) {
                if(ctx.params.pass && ctx.params.pass==process.env.RESTART_PASS) {
                    let res = null
                    const { stdout, stderr } = await exec('bash restart.sh')
                    return await {"message":"Command executed. Check for 'restarted' file", code: 200}
                } else {
                    return await {"message":"Error", code: 403}
                }
            }
		},
    }
}

module.exports = service