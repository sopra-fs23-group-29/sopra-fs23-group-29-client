import React, { useState }  from 'react';
import "styles/views/Board.scss";
import PropTypes from "prop-types";

const mixColors = (colorArray) => {
    // no need to do something fancy if there is just one color
    if (colorArray.length === 1) {
        return colorArray[0];
    }
    // need to mix multiple colors
    else {
        return colorArray[1];
    }
}
const Field = ({colors}) => {
    return (
        <div className="position container"
             style={{background: mixColors(colors)}}
        >
        </div>
    )
}

const Start = ({colors}) => {
    return (
        <div className="start container"
             style={{background: mixColors(colors)}}
        >
        </div>
    )
}


const Barrier = ({colors}) => {
    return (
        <div className="barrier container">
            <i className="barrier icon"
               style={{color: mixColors(colors)}}
            >
                error_outlined</i>
        </div>
    )
}


const End = ({colors}) => {
    return (
        <div className="end container"
             style={{background: mixColors(colors)}}
        >
        </div>
    )
}

export {Start, Field, Barrier, End};