import React from 'react';
import "styles/views/Board.scss";

const Field = ({color}) => {
    return (
        <div className="position container"
             style={{background: color}}
             //onChange={(newColor) => props.onChange(props.color)}
        >
        </div>
    )
}

const Start = ({color}) => {
    return (
        <div className="start container"
             style={{background: color}}
        >
        </div>
    )
}


const Barrier = ({color}) => {
    return (
        <div className="barrier container">
            <i className="barrier icon"
                style={{color: color}}
            >
                error_outlined</i>
        </div>
    )
}


const End = ({color}) => {
    return (
        <div className="end container"
             style={{background: color}}
        >
        </div>
    )
}

export {Start, Field, Barrier, End};