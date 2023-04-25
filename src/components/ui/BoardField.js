import React from 'react';
import "styles/views/Board.scss";


/**
 * components
 */
const Field = (props) => {
    return (
        <div className="position container"
        >
            {
                props.children
            }
        </div>
    )
}

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

            <i className="barrier icon"
               style={{color: colors}}
            >
                error_outlined</i>

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