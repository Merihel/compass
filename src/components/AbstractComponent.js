import React from "react"
import theme from "../assets/theme"

class AbstractComponent extends React.Component {
    constructor(props) {
        super(props)

        this.theme = theme
    }
}

export default AbstractComponent