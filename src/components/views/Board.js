import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import BaseContainer from "components/ui/BaseContainer";


export const Board = (props) => {
    const withBarriers = true;


    const getBoardParams = (mode) => {
        switch (mode) {
            case "pvp":
                return [0, 5, 15, 20, 30, 29];
        }
    }

    function fieldMapper(min, max, end) {
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
            else if (index === end) {
                fields.push(
                    <End key={index}>

                    </End>
                )
            }
            // barriers
            else if (withBarriers
                        && ((index - 1)%3 === 0)
                        && (index > 3)
                        && (end - index > 2)
            ) {
                fields.push(
                    <Barrier key={index}>

                    </Barrier>
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field
                        key={index}
                        color="blue"
                    >

                    </Field>
                )
            }
            index += 1;
        }
        return fields;
    }


    const boardParams = getBoardParams("pvp");
    return <BaseContainer className="board container">
        <div className="board left-column container">
            {
                // these are bottom up, hence reverse()
                fieldMapper(boardParams[0], boardParams[1], boardParams[5]).reverse()
            }
        </div>

        <div className="board top-row container">
            {
                // left to right
                fieldMapper(boardParams[1], boardParams[2], boardParams[5])
            }
        </div>

        <div className="board right-column container">
            {
                // top to bottom
                fieldMapper(boardParams[2], boardParams[3], boardParams[5])
            }
        </div>

        <div className="board bottom-row container">
            {
                // right to left, hence reverse()
                fieldMapper(boardParams[3], boardParams[4], boardParams[5]).reverse()
            }
        </div>
    </BaseContainer>
}
