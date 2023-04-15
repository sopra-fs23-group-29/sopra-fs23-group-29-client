import React from "react";
import "styles/views/Board.scss";
import BaseContainer from "../ui/BaseContainer";

/**
 * Abstract Class BoardField
 */
class BoardField extends React.Component{
    baseColour;
    colours;

    constructor(baseColour) {
        super(null);
        this.baseColour = baseColour;
        this.colours = [this.baseColour];
    }

    setPosition(left, top) {
        this.left = left;
        this.top = top;
    }

    addColour(newColour) {
        // no need to add the colour if it is already present
        if (this.colours.indexOf(newColour) !== -1) {
            return
        }

        // if the first colour is white then it is the only colour and should be replaced
        if (this.colours[0] === this.baseColour) {
            this.colours[0] = newColour;
        }

        // if it has other colours add the new colour
        else {
            this.colours.push(newColour);
        }
    }

    removeColour(toRemoveColour) {
        // get index of the colour which should be removed
        const index = this.colours.indexOf(toRemoveColour);

        // cannot remove a colour which is not present
        if (index === -1) {
            return
        }
        // remove the colour if it is present
        else {
            this.colours.splice(index, 1);
        }

        // if colours is now empty add back "white" as default
        if (this.colours.length === 0) {
            this.colours.push(this.baseColour);
        }
    }

    render() {
        return (
            <div color="red">
                BoardField should not get rendered!
            </div>
        )
    }
}
class Field extends BoardField {
    render() {
        return (
            <div className="position">
                field
                style={{
                    color: `${this.colours[0]}`,
                    position: "absolute",
                    left: `${this.left}`,
                    top: `${this.top}`
            }}
            </div>
        )
    }
}
class Barrier extends BoardField {
    render() {
        return (
            <div className="barrier">
                barrier
                style={{
                    color: `${this.colours[0]}`,
                    position: "absolute",
                    left: `${this.left}`,
                    top: `${this.top}`
            }}
            </div>
        )
    }
}

class Start extends BoardField {
    render() {
        return (
            <div  className="start">
                start
                style={{
                    color: `${this.colours[0]}`,
                    position: "absolute",
                    left: `${this.left}`,
                    top: `${this.top}`
                }}
            </div>
        )
    }
}

class End extends BoardField {
    render() {
        return (
            <div className="end">
                end
                style={{
                    color: `${this.colours[0]}`,
                    position: "absolute",
                    left: `${this.left}`,
                    top: `${this.top}`
            }}
            </div>
        )
    }
}
export {Field, Barrier, Start, End};