class AbstractServiceRequest {
    constructor(model,method,params = {}, auth = null) {
        this.secure = false
        this.brokerHost = process.env.REACT_APP_BROKER_HOST || "127.0.0.1"
        this.brokerPort = process.env.REACT_APP_BROKER_PORT || "3001"
        this.model = model
        this.method = method
        this.params = params
        this.auth = auth
    }

    
    async execute() {
        try {
            let route = (this.secure ? "https://":"http://")+this.brokerHost+":"+this.brokerPort+"/api/"+this.model
            let flagFirst = false
            for (const [key, value] of Object.entries(this.params)) {
                route+=(!flagFirst ? "?":"&")+key+"="+value
                flagFirst = true
            }
            const headers = new Headers()
            if(this.auth) {
                headers.append("Authorization", "Bearer "+this.auth);
            }
            const init = {
                method: this.method,
                headers: headers
            }
            const result = await fetch(route,init)
            if(!result.ok) {
                return await this.onError(result)
            } else {
                return await this.onFinish(result)
            }
        } catch(e) {
            return e
        }
    }

    async onFinish(result) {
        return {error: true, message: "Developer did not implemented onFinish for this request !", code: 500, data: null}
    }
    async onError(result) {
        return {error: true, message: "Developer did not implemented onError for this request !", code: 500, data: null}
    }
}

export default AbstractServiceRequest
