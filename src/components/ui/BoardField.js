import React from 'react';
import "styles/views/Board.scss";

/**
 * components
 * Field, Start and End are practically identical
 * planned to differentiate them visually
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

const End = (props) => {
    return (
        <div className="end container">
            {
                props.children
            }
        </div>
    )
}

class Barrier extends React.Component {
    constructor(props) {
        super(props);
        let {color} = props;

        this.state = {
            color: color,
            cleared: false
        }
    }

    clearBarrier(newColor) {
        this.setState({
            color: newColor,
            cleared: true
        })
    }

    isCleared() {
        return this.state.cleared;
    }

    render() {
        return (
            <div className="barrier container">

                <i className="barrier icon"
                   style={{color: this.state.color}}
                >
                    error_outlined</i>
            </div>
        )
    }
}

export {Start, Field, End, Barrier};