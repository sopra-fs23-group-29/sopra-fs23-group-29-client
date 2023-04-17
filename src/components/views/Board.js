import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import BaseContainer from "components/ui/BaseContainer";


export class Board {

    numFields = 29;
    arrangement = [];
    fields = [];
    barriers = [];

    withBarriers = true;


    getBoardParams(gamemode) {
        switch (gamemode) {
            case "pvp":
                return [0, 5, 15, 20, 30];
        }
    }

    fieldMapper(min, max) {
        if (max <= min) {
            throw new Error("max needs to be larger than min!")
        }
        let index = min
        let fields = [];

        while (index < max) {
            // start
            if (index === 0) {
                fields.push(
                    <Start key={index}>

                    </Start>
                )
            }
            // end
            else if (index === this.numFields) {
                fields.push(
                    <End key={index}>

                    </End>
                )
            }
            // barriers
            else if (this.withBarriers && ((index - 3)%3 === 0)) {
                fields.push(
                    <Barrier key={index}>

                    </Barrier>
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field key={index}>

                    </Field>
                )
            }
            index += 1;
        }
        return fields;
    }


    displayBoard() {
        const boardParams = this.getBoardParams("pvp");
        return <BaseContainer className="board container">
            <div className="board left-column container">
                {
                    // these are bottom up, hence reverse()
                    this.fieldMapper(boardParams[0], boardParams[1]).reverse()
                }
            </div>

            <div className="board top-row container">
                {
                    // left to right
                    this.fieldMapper(boardParams[1], boardParams[2])
                }
            </div>

            <div className="board right-column container">
                {
                    // top to bottom
                    this.fieldMapper(boardParams[2], boardParams[3])
                }
            </div>

            <div className="board bottom-row container">
                {
                    // right to left, hence reverse()
                    this.fieldMapper(boardParams[3], boardParams[4]).reverse()
                }
            </div>
        </BaseContainer>
    }
}
