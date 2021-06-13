import React from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import UserDefinedDash from "../components/UserDefinedDash"

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }

        const _refSidebar = null
    }

    componentDidMount() {
        
    }

    onNavbarBurgerClick() {
        this._refSidebar._toggleSidebar()
    }

    render() {
        return (
            <div className="container-main w-screen h-screen flex flex-col">
                <Navbar onBurgerClick={() => {this.onNavbarBurgerClick()}} />
                <div className="container-middle w-full flex flex-row">
                    <Sidebar ref={it => {this._refSidebar = it}}/>
                    <div className="container-content w-full">
                        <UserDefinedDash />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard