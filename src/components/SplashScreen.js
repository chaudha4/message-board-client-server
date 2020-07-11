import React, {useState} from "react";
import ReactLoading from 'react-loading';

export default function SplashScreen({WrappedComponent}) {

    console.log("Entering SplashScreen");


    return (
        <div className="SplashScreen">
            <ReactLoading type="spin"
            color="blue" 
            height="20%"
            width="20%" />
        </div>
    );

}