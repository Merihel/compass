import React from "react"
import { Button } from "semantic-ui-react"
import AbstractComponent from "./AbstractComponent"

class Navbar extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return(
            <div className="w-full h-16 fixed bg-dark">
                <Button onClick={() => {this.props.onBurgerClick()}}/>
                <span className='text-red-500'>helldo</span>
            </div>
        )
    }
}

export default Navbar