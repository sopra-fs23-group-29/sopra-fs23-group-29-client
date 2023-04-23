import React, { useState }  from 'react';
import "styles/views/Board.scss";
import PropTypes from "prop-types";
import { mixColors } from "helpers/LinearGradient";

/**
 * components
 */
const Field = ({colors, place}) => {
    return (
        <div className="position container">
            {mixColors(colors, place)}
        </div>
    )
}

const Start = ({colors, place}) => {
    return (
        <div className="start container">
            {
                mixColors(colors, place)
            }
        </div>
    )
}

const Barrier = ({colors, place}) => {
    return (
        <div className="barrier container">
            <i className="barrier icon"
               style={{color: mixColors(colors, place)}}
            >
                error_outlined</i>

        </div>
    )
}

const End = ({colors, place}) => {
    return (
        <div className="end container">
            {
                mixColors(colors, place)
            }
        </div>
    )
}

export {Start, Field, Barrier, End};