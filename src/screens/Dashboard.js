import React from "react"
import Navbar from "./fragments/Navbar"
import Sidebar from "./fragments/Sidebar"
import UserDash from "./fragments/UserDash"

class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sidebarState: true,
            page: 0
        }

        const _refSidebar = null
    }
    
    onNavbarBurgerClick() {
        this._refSidebar._toggleSidebar()
        this.setState({ sidebarState: !this.state.sidebarState })
    }

    renderPage() {

    }

    render() {
        const dashWidth = this.state.sidebarState ? "w-4/5 " : "w-full"
        return (
            <div className="bg-gray-800 container-main w-screen min-h-screen flex flex-col">
                <Navbar username={this.props.auth.login} sidebarState={this.state.sidebarState} onBurgerClick={() => { this.onNavbarBurgerClick() }} />
                <div className="container-middle w-full h-full flex flex-row">
                    <Sidebar ref={it => { this._refSidebar = it }} />
                    <div className={"container-content transition-all " + dashWidth}>
                        <UserDash sidebarState={this.state.sidebarState} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard