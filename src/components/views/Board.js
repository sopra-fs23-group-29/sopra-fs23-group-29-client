import {Field, Barrier, Start, End} from "./BoardField";
import "styles/views/Board.scss";
import BaseContainer from "components/ui/BaseContainer";

export class Board {

    numFields;
    arrangement = [];
    fields = [];
    barriers = [];
    fieldSize = "20px";

    constructor(numFields) {
        this.numFields = numFields;
        this.createArrangement();
    }

    createArrangement() {
        let numPlacedFields = 0;
        let index;
        let field;
        let barrier;

        // add the start field at the start
        const start = new Start(this.fieldSize*2, "purple");
        this.arrangement.push(start);
        this.placeField(start, 0);

        // add the normal fields and barriers
        while (numPlacedFields < this.numFields-1) {
            // we use the number of already placed fields as index when placing the new fields on the board
            index = this.fields.length + this.barriers.length + 1; // +1 because of start

            // place a normal field
            field = new Field(this.fieldSize, "lightblue");
            this.fields.push(field);
            this.placeField(field, index)
            numPlacedFields += 1;

            // behind the 3rd and thereafter behind every 2nd field is a barrier
            if ((numPlacedFields - 3)%2 === 0) {
                barrier = new Barrier(this.fieldSize, "lightgreen");
                this.barriers.push(barrier);
                this.placeField(barrier, index+1)
            }
        }

        // add the end field at the end
        const end = new End(this.fieldSize*2, "indigo");
        this.placeField(end, this.fields.length + this.barriers.length + 1);
    }

    placeField(field, index) {
        // throw error for non-valid index
        if (typeof index !== "number") {
            throw new Error("'index' needs to be a number!")
        }
        if ((index < 0) || (index > 47)) {
            throw new Error(`'index' needs to be in the range: [0, 47]`)
        }


        // left column (start up)
        if (index < 5) {

        }

        // top row
        else if (index < 21) {

        }

        // right column
        else if (index < 30) {

        }

        // bottom column
        else if (index < 46) {

        }

        // left column (bottom up)
        if (index < 48)  {

        }
    }

    displayBoard() {
        return (
            <BaseContainer className="board container">
                <div className="board left-column">

                </div>

                <div className="board top-row">

                </div>

                <div className="board right-column">

                </div>

                <div className="board bottom-row">

                </div>

                <div className="board middle">

                </div>
            </BaseContainer>
        )
    }
}
