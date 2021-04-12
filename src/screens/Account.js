import React from "react"

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false
        }
    }

    componentDidMount() {
        
    }

    login() {
        const res = {error: false, data: {name:"Meryy"}}
        if(!res.error) {
            this.props.onLogin(res.data)
        } else {
            console.warn("Cannot login user !")
        }
    }

    render() {
        return (
            <div id="screen-home">
                Hello From Home ! <br></br>
                {!this.props.auth ? <button onClick={() => {this.login()}}>Login now !</button> : "Bienvenue "+this.props.auth.name}
            </div>
        )
    }
}

export default Home