import React from "react";
import "./ImageLinkForm.css"

const ImageLinkForm = () => {
    return (
    <div>
        <p className="f3"> 
        {'This Magic brain will detect faces in your pictures. Give it a try!'}
        </p>
        <div className="center">
            <div className="pa4 form br3 shadow-5 center"> 
                <input className="br3 f4 pa2 w-70 b--white" type='text'></input>
                <button className="br3 f4 w-30 grow link  pv2 dib white bg-light-purple b--light-purple">Detect</button>
            </div>
        </div>
    </div>
    );
}

export default ImageLinkForm;