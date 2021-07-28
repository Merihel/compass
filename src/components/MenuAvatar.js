import {Image} from "semantic-ui-react"
//comps
import AbstractComponent from "./AbstractComponent"
//utils
import String from "../utils/String"

class MenuAvatar extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            url: this.props.url
        }
    }

    componentDidMount() {
        this.staticAvatar()
    }

    animateAvatar() {
        if(this.props.url && this.props.url.endsWith(".gif")) {
            const newUrl = this.props.url.replace(".png", ".gif")
            this.setState({url:newUrl})
        }
    }

    staticAvatar() {
        if(this.props.url) this.setState({url: this.props.url.replace(".gif", ".png")})
    }

    render() {
        return( 
            <div onMouseEnter={() => this.animateAvatar()} onMouseLeave={() => this.staticAvatar()} className="flex flex-row items-center cursor-pointer h-full hover:bg-gray-700 p-2 pl-4 transition-all">
                <Image src={this.state.url ? this.state.url : "/no-image.png"} avatar />
                <div className="flex flex-col m-2 ml-1">
                    <span>{this.props.username ? String.ellipsis(this.props.username, 20) : "---"}</span>
                    <span className="text-sm text-gray-300">{this.props.subname ? this.props.subname : "---"}</span>
                </div>
            </div>
        )
    }
}

export default MenuAvatar