import React from 'react';
import "styles/views/Board.scss";
import PropTypes from "prop-types";

const Field = (props) => {
    return (
        <div className="position container"
            color={props.color}>
        </div>
    )
}

Field.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
};


const Start = (props) => {
    return (
        <div className="start container"
             color={props.color}>
        </div>
    )
}

Start.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
};

const Barrier = (props) => {
    return (
        <div className="barrier container"
             color={props.color}>
        </div>
    )
}

Barrier.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
};

const End = (props) => {
    return (
        <div className="end container"
             color={props.color}>
        </div>
    )
}

End.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
};

export {Start, Field, Barrier, End};