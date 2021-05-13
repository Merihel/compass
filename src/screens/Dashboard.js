import React from "react"

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div id="screen-dashboard">
                Hello From Dashboard ! <br></br>
                {"Bienvenue "+this.props.auth.login}
            </div>
        )
    }
}

export default Dashboard