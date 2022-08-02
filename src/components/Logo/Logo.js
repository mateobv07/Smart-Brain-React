import React from "react";
import Tilt from 'react-parallax-tilt';
import "./Logo.css"
import brain from "./brain.png"

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="Tilt pa2 br2 shadow-2" style={{ height: 110, width: 120}}>
                <img style={{flexShrink: 0, width: '95%', height: '100%'}} src={brain} alt="Brain Logo" />
            </Tilt>
        </div>
    );
}

export default Logo;