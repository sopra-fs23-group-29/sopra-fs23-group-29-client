import React from 'react';
import "styles/views/Board.scss";
/*
import PropTypes from "prop-types";
import { useState } from "react";
import { mixColors } from "helpers/LinearGradient";
 */

/**
 * components
 */
const Field = (props, {index}) => {
    //const [colors, setColors] = useState(initialColors);
    return (
        <div className="position container"
            id={index}
        >
            {

            }
        </div>
    )
}
 /*
Field.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    onChange: PropTypes.func,
};

  */

const Start = (props) => {
    return (
        <div className="start container">
            {
                props.children
            }
        </div>
    )
}

const Barrier = (props, {colors}) => {
    return (
        <div className="barrier container">
            { props.children }
            <i className="barrier icon"
               style={{color: colors}}
            >
                error_outlined</i>
            {
                props.children
            }
        </div>
    )
}

const End = (props) => {
    return (
        <div className="end container">
            {
                props.children
            }
        </div>
    )
}

export {Start, Field, Barrier, End};