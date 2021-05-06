import AbstractServiceRequest from "./AbstractServiceRequest";

class AuthServiceRequest extends AbstractServiceRequest {
    constructor(model,method,params = {}) {
        super(model,method,params)
    }

    async onFinish(result) {
        const json = await result.json()
        return await {error: false, message: "OK", code: result.status, data: json}
    }

    async onError(result) {
        const json = await result.json()
        return await {error: true, errorName:json.name, message: json.message, code: json.code, data: null}
    }
}

export default AuthServiceRequest