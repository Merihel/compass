const service = {
    name: "math",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        },
        substract(ctx) {
            return Number(ctx.params.a) - Number(ctx.params.b);
        },
        multiply(ctx) {
            return Number(ctx.params.a) * Number(ctx.params.b);
        },
        divide(ctx) {
            return Number(ctx.params.a) / Number(ctx.params.b);
        },
        info(ctx) {
            console.log(ctx.params)
            switch (parseInt(ctx.params.idinfo)) {
                case 0:
                    return "C'est le 0, chiffre nul le plus connu"
                    break;
                case 1:
                    return "Tout le monde connaît 1 ^^"
                    break;
                default:
                    return "oof ça a crash"
                    break;
            }
        }
    }
}

module.exports = service