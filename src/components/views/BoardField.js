import "styles/views/Board.scss";
import BaseContainer from "../ui/BaseContainer";

/**
 * Abstract Class BoardField
 */
class BoardField {
    baseColour;
    colours;
    size;

    constructor(size, baseColour) {
        this.baseColour = baseColour;
        this.colours = [this.baseColour];
        this.size = size;
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

    displayField() {
        throw new Error("Method 'displayField()' must be implemented");
    }
}
class Field extends BoardField {
    displayField = () => (
        <BaseContainer className="field">
            color={this.colours[0]}
        </BaseContainer>
    );
}
class Barrier extends BoardField {
    displayField = () => (
        <BaseContainer className="barrier">
            color={this.colours[0]}
        </BaseContainer>
    );
}

class Start extends BoardField {
    displayField = () => (
        <BaseContainer className="start">
            color={this.colours[0]}
        </BaseContainer>
    );
}

class End extends BoardField {
    displayField = () => (
        <BaseContainer className="end">
            color={this.colours[0]}
        </BaseContainer>
    );
}
export {Field, Barrier, Start, End};