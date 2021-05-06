import React from 'react'
import { Image } from 'semantic-ui-react'
import { pulse } from 'react-animations'
import Radium, {StyleRoot} from 'radium';

const styles = {
    pulse: {
      animation: 'x 0.8s ease infinite',
      animationName: Radium.keyframes(pulse, 'pulse'),
    }
}

const Loader = (props) => {
    return (
        <StyleRoot>
            <div style={styles.pulse}>
                <img src="/logo.png" className="custom" />
            </div>
        </StyleRoot>
    )
}

export default Loader