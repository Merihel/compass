import React from "react"
import { Icon } from 'semantic-ui-react'
import AbstractComponent from "./AbstractComponent"

class Navbar extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            burgerToggle: false
        }
    }

    render() {
        let icon = this.state.burgerToggle ? "close" : "bars"
        return(
            <div className="navbar">
                <Icon onClick={() => this.setState({burgerToggle: !this.state.burgerToggle})} style={{cursor: "pointer"}} color={this.theme.textPrimary} name={icon} size="big" />
                <span>Voix ambiguë d'un cœur qui, au zéphyr, préfère les jattes de kiwis.</span>
            </div>
        )
    }
}

export default Navbar