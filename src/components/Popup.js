import React from "react";

export default function Popup(props) {

    console.log("Popup rendered");

    return (
        <div className="modal">
            <div className="modal_content">
                <h3>Message</h3>
                <p>{props.mesg ? props.mesg : "popup default text"}</p>
                <button className="button"
                    type="button"
                    onClick={(e) => props.hidePopup()}>
                    Close
                    </button>
            </div>
        </div>

    ); //return

    
}