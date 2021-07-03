import React from "react"
import { Button } from "semantic-ui-react"
//components
import AbstractComponent from "../../components/AbstractComponent"
import AnimatedBurger from "../../components/AnimatedBurger"

class Navbar extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            scrollPos: 0
        }
    }

    //Scroll event listener for shadow
    componentDidMount() {
      window.addEventListener('scroll', this.scrollListener)
    }
    
    componentWillUnmount() {
      window.removeEventListener('scroll', this.scrollListener)
    }
    scrollListener = () => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop
        const height =
          document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = winScroll / height
        this.setState({
          scrollPos: scrolled,
        })
    }

    render() {
        const leftSide = this.props.sidebarState ? "w-1/5 " : "w-20 " 
        const shadow = this.state.scrollPos > 0 ? "shadow" : ""
        const displayImage = this.props.sidebarState ? "" : "hidden"
        return(
            <div className={"-top-px w-full h-16 fixed bg-dark flex flex-row z-10 " + shadow}>
                <div className={leftSide + "transition-all duration-300 justify-end flex"}>
                    <AnimatedBurger stateOnInit={this.props.sidebarState} onBurgerClick={() => {this.props.onBurgerClick()}} />
                </div>
            </div>
        )
    }
}

export default Navbar