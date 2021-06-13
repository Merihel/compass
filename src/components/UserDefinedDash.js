import React from "react"
import AbstractComponent from "./AbstractComponent"

class UserDefinedDash extends AbstractComponent {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return(
            <div className="w-full h-full pt-16 bg-yellow-900 flex flex-col">
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
                <span className='text-green-400 text-9xl'>Bouh</span>
            </div>
        )
    }
}

export default UserDefinedDash