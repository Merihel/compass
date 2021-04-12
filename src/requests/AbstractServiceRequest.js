class AbstractServiceRequest {
    constructor(model,method,params = {}) {
        this.secure = false
        this.brokerHost = "127.0.0.1"
        this.brokerPort = "3000"
        this.model = model
        this.method = method
        this.params = params
    }

    async execute() {
        try {
            let route = (this.secure ? "https://":"http://")+this.brokerHost+":"+this.brokerPort+"/"+this.model
            let flagFirst = false
            for (const [key, value] of Object.entries(this.params)) {
                route+=(!flagFirst ? "?":"&")+key+"="+value
                flagFirst = true
            }
            const init = {
                method: this.method
            }
            const result = await fetch(route,init)
            const json = await result.json()
            console.log(json)
            return json
        } catch(e) {
            return e
        }
    }
}

export default AbstractServiceRequest
