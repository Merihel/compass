import React from "react"
import AbstractComponent from "./AbstractComponent"

class Sidebar extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            show: true
        }
    }

    _toggleSidebar() {
        this.setState({show: !this.state.show})
    }

    render() {
        const show = this.state.show ? "w-1/5 " : "w-20 "
        return(
            <div className={show + "h-100 pt-16 bg-dark p-4 transition-all"}>
                <span className='text-yellow-400'>HI</span>
            </div>
        )
    }
}

export default Sidebar