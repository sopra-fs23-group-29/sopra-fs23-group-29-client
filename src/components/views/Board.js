import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


export const Board = (props) => {
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
    function createColorArray(end) {
        let index = 0;
        let colorArray = [];
        while (index <= end)  {
            if (withBarriers && isBarrier(index, end)) {
                colorArray.push(theme.textColor);
                //colorArray.push("red");
            } else {
                colorArray.push(theme.containerColor)
                //colorArray.push("blue");
            }
            index += 1;
        }

        return colorArray;
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
                    <Start
                        key={index}
                        color={colors[index]}
                    />
                )
            }
            // end
            else if (index === end) {
                fields.push(
                    <End
                        key={index}
                        color={colors[index]}
                    />
                )
            }
            // barriers
            else if (withBarriers && isBarrier(index, end)) {
                fields.push(
                    <Barrier
                        key={index}
                        color={colors[index]}
                    />
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field
                        key={index}
                        color={colors[index]}
                    />
                )
            }
            index += 1;
        }
        return fields;
    }

    const boardParams = getBoardParams("pvp-large");
    const colors = createColorArray(boardParams[5])
    return <BaseContainer className="board container">
        <div className="board left-column container">
            {
                // bottom to top, hence reverse()
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

Board.propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
};