const service = {
    name: "broker",
    actions: {
        async info(ctx) {
            const health = await ctx.broker.getHealthStatus()
            return health
        }
    }
}

module.exports = service