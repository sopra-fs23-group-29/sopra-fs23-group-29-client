import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";


export const Board = (props) => {
    /**
     * functions needed to create the board
     */
    let withBarriers = true;

    const getBoardParams = (mode) => {
        switch (mode) {
            case "pvp-large":
                return [0, 5, 15, 20, 30, 29];
            case "pvp-small":
                withBarriers = false;
                return [0, 3, 8, 11, 16, 15];
        }
    }

    const isBarrier = (index, end) => {
        return ((index - 1)%3 === 0)
                && (index > 3)
                && (end - index > 2)
    }

    function createColorArray(end, allowBarriers) {
        let index = 0;
        let colorArray = [];
        while (index <= end)  {
            if (allowBarriers && isBarrier(index, end)) {
                colorArray.push([theme.textColor]);
                //colorArray.push("red");
            } else {
                colorArray.push([theme.containerColor])
                //colorArray.push("blue");
            }
            index += 1;
        }

        return colorArray;
    }

    function fieldMapper(min, max, end, allowBarriers) {
        if (max <= min) {
            throw new Error("max needs to be larger than min!")
        }
        let index = min
        let fields = [];

        while (index < max) {
            // start
            if (index === 0) {
                fields.push(
                    <Start
                        key={index}
                        colors={colors[index]}
                    />
                )
            }
            // end
            else if (index === end) {
                fields.push(
                    <End
                        key={index}
                        colors={colors[index]}
                    />
                )
            }
            // barriers
            else if (allowBarriers && isBarrier(index, end)) {
                fields.push(
                    <Barrier
                        key={index}
                        colors={colors[index]}
                    />
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field
                        key={index}
                        colors={colors[index]}

                    />
                )
            }
            index += 1;
        }
        return fields;
    }

    /**
     * function needed to update the board
     */
    function updateColors(index, newColors) {
        // please sen help
    }

    /**
     * create and return the board
     */
    const boardParams = getBoardParams("pvp-large");
    const colors = createColorArray(boardParams[5], withBarriers);

    const fields = fieldMapper(boardParams[0], boardParams[4], boardParams[5], withBarriers);

    const leftColumn = fields.slice(boardParams[0], boardParams[1]);
    const topRow = fields.slice(boardParams[1], boardParams[2]);
    const rightColumn = fields.slice(boardParams[2], boardParams[3]);
    const bottomRow = fields.slice(boardParams[3], boardParams[4]);

    return <BaseContainer className="board container">
        <div className="board left-column container">
            {
                // bottom to top, hence reverse()
                leftColumn.reverse()
            }
        </div>

        <div className="board top-row container">
            {
                // left to right
                topRow
            }
        </div>

        <div className="board right-column container">
            {
                // top to bottom
                rightColumn
            }
        </div>

        <div className="board bottom-row container">
            {
                // right to left, hence reverse()
                bottomRow.reverse()
            }
        </div>
        <Button
            position="fixed"
            left="40%"
            top="40%"
            onClick={() => updateColors(1, ["red"])}>
            change colors
        </Button>

    </BaseContainer>
}

Board.propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
};