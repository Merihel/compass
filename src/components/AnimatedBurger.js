import React from "react"
import { HamburgerSlider } from 'react-animated-burgers'

class AnimatedBurger extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isActive: this.props.stateOnInit ? this.props.stateOnInit : true
        }
    }

    toggle() {
        this.setState({ isActive: !this.state.isActive })
        this.props.onBurgerClick()
    }

    render() {
        return (
            <HamburgerSlider 
                isActive={this.state.isActive} 
                toggleButton={() => this.toggle()}
                barColor="white"
                className="no-outline ml-4"
            />
        )
    }
} 

export default AnimatedBurger