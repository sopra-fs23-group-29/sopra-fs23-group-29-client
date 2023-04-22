import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";


export const Board = (props) => {
    let withBarriers = true;
    let gameMode = "pvp-large";

    /**
     * helper functions to locate and identify fields
     */
    const getPlaceOnBoard = (index, boardParams) => {
        let counter = 0;

        // locate field on the board
        while (counter < boardParams.length) {
            if (index < boardParams[counter]) {
                break;
            }
            counter += 1;
        }
        let place;
        switch (counter) {
            case 1:
                place = "left column";
                break;
            case 2:
                place = "top row";
                break;
            case 3:
                place = "right column";
                break
            case 4:
                place = "bottom row";
                break;
            default:
                console.log(`could not locate index: ${index}`)
                place = "top row";
                break;
        }
        return place;
    }

    const isBarrier = (index, end) => {
        return ((index - 1)%3 === 0)
            && (index > 3)
            && (end - index > 2)
    }

    /**
     * functions used to create the board
     */
     const getBoardParams = (mode) => {
        switch (mode) {
            case "pvp-large":
                return [0, 5, 15, 20, 30, 29];
            case "pvp-small":
                withBarriers = false;
                return [0, 3, 8, 11, 16, 15];
        }
    }

    function createColorArray(end, allowBarriers) {
        let index = 0;
        let colorArray = [];
        while (index <= end)  {
            if (allowBarriers && isBarrier(index, end)) {
                colorArray.push([]);
            } else {
                colorArray.push(["red", "yellow"])
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
                        place={getPlaceOnBoard(index, boardParams)}
                    />
                )
            }
            // end
            else if (index === end) {
                fields.push(
                    <End
                        key={index}
                        colors={colors[index]}
                        place={getPlaceOnBoard(index, boardParams)}
                    />
                )
            }
            // barriers
            else if (allowBarriers && isBarrier(index, end)) {
                fields.push(
                    <Barrier
                        key={index}
                        colors={colors[index]}
                        place={getPlaceOnBoard(index, boardParams)}
                    />
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field
                        key={index}
                        colors={colors[index]}
                        place={getPlaceOnBoard(index, boardParams)}
                    />
                )
            }
            index += 1;
        }
        return fields;
    }

    /**
     * functions used to update the board
     */
    function updateColors(index, newColors) {
        // please sen help
    }

    /**
     * create and return the board
     */
    const boardParams = getBoardParams(gameMode);
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
            onClick={() => updateColors(1, ["red"])}>
            change colors
        </Button>

    </BaseContainer>
}

Board.propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
};