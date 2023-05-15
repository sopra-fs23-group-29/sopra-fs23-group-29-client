import {Start, Field, End, Barrier} from "./BoardField";
import React from 'react';
import "styles/ui/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Gradient } from "components/ui/LinearGradient";


class Board extends React.Component {
    // setting the board with the props passed by Game.js
    withBarriers = this.props.withBarriers;
    boardSize = this.props.boardSize;
    numFields = this.props.numFields;
    gameMode = this.props.gameMode;

    // constants
    containerColor = theme.containerColor;
    textColor = theme.textColor;

    /**
     * helper functions to locate fields and identify barriers
     */
    getPlaceOnBoard(index, parameters){
        let counter = 0;

        // locate field on the board
        while (counter < parameters.length) {
            if (index < parameters[counter]) {
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

    isBarrier(index, end){
        return ((index - 1)%3 === 0)
            && (index > 3)
            && (end - index > 2)
    }

    /**
     * functions used to create the board
     */
    getBoardParams(size){
        // console.log(`getBoardParams: ${size}`);
        switch (size) {
            case "small":
                return [0, 3, 9, 12, 12, 11];
            case "medium":
                return [0, 4, 12, 16, 24, 23];
            case "large":
                return [0, 7, 24, 31, 48, 47];
            default:
                // large
                return [0, 7, 24, 31, 48, 47];
        }
    }

    createColorArray(end, allowBarriers) {
        let colorArray = []
        for (let index = 0; index <= end; index++) {
            if (allowBarriers && this.isBarrier(index, end)) {
                colorArray.push([this.textColor]);
            } else {
                colorArray.push([this.containerColor]);
            }
        }
        return colorArray;
    }

    createGradientAndBarrierArray(parameters, allowBarriers) {
        let gradientAndBarrierArray = [];
        let gradient;
        let barrier;
        let end = parameters[5];

        for (let index = 0; index <= end; index++) {
            if (allowBarriers && this.isBarrier(index, end)) {
                barrier = (
                    <Barrier
                        color={this.colors[index]}
                        ref={React.createRef()}
                        key={index}
                    />)
                gradientAndBarrierArray.push(barrier)
            } else {
                gradient = (
                    <Gradient
                        ind={100 + index}
                        colorArray={this.colors[index]}
                        placeOnBoard={this.getPlaceOnBoard(index, parameters)}
                        ref={React.createRef()}
                    />)
                gradientAndBarrierArray.push(gradient)
            }
        }
        return gradientAndBarrierArray;
    }

    fieldMapper(parameters, allowBarriers, gradientsAndBarriers) {
        const min = parameters[0];
        const max = parameters[4];
        const end = parameters[5];

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
                        {gradientsAndBarriers[index]}
                    </Start>
                )
            }
            // end
            else if (index === end) {
                fields.push(
                    <End key={index}>
                        {gradientsAndBarriers[index]}
                    </End>
                )
            }
            // barriers
            else if (allowBarriers && this.isBarrier(index, end)) {
                fields.push(
                    gradientsAndBarriers[index]
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field key={index}>
                        {gradientsAndBarriers[index]}
                    </Field>
                )
            }
            index += 1;
        }
        return fields;
    }

    /**
     * functions used to update the board
     */
    getColors() {
        return this.colors;
    }

    getEndingField(startField) {
        const nextField = startField + 1;
        if (this.gameMode === "HOWFAR") {
            return nextField%this.numFields;
        } else {
            return Math.min(nextField, this.numFields - 1);
        }
    }

    async movePlayerOnce(player, field, colorArray, allowBarriers) {
        // console.log(`movePlayer : PlayerColor ${player.playerColor}`);
        const color = player.playerColor;
        const startingField = field%this.numFields; //player.currentField;

        // remove the player from the current field
        const startingColors = colorArray[startingField];
        const index = startingColors.indexOf(color);
        startingColors.splice(index, 1);
        this.gradientsAndBarriers[startingField].ref.current.updateColors(startingColors);

        // move the player one field forward
        // we need to handle solo games where the player can take multiple laps
        const endingField = this.getEndingField(startingField);
        const endingColors = colorArray[endingField];
        const endBoardField = this.gradientsAndBarriers[endingField].ref.current;

        if (allowBarriers && this.isBarrier(endingField, this.boardParams[5])) {
            // we need to clear barriers if they aren't already
            if (!endBoardField.isCleared()) {
                endBoardField.clearBarrier(color);
            }
        }
        endingColors.push(color);
        endBoardField.updateColors(endingColors);

        await new Promise(r => setTimeout(r, 200));
        return colorArray;
    }

    /**
     * create and return the board
     */
    boardParams = this.getBoardParams(this.boardSize);
    colors = this.createColorArray(this.boardParams[5], this.withBarriers);
    gradientsAndBarriers = this.createGradientAndBarrierArray(this.boardParams, this.withBarriers);
    fields = this.fieldMapper(this.boardParams, this.withBarriers, this.gradientsAndBarriers);

    leftColumn = this.fields.slice(this.boardParams[0], this.boardParams[1]).reverse();
    topRow = this.fields.slice(this.boardParams[1], this.boardParams[2]);
    rightColumn = this.fields.slice(this.boardParams[2], this.boardParams[3]);
    bottomRow = this.fields.slice(this.boardParams[3], this.boardParams[4]).reverse();

    render() {
        return <BaseContainer className="board container">
            <div className="board left-column container">
                {
                    this.leftColumn
                }
            </div>

            <div className="board top-row container">
                {
                    this.topRow
                }
            </div>

            <div className="board right-column container">
                {
                    this.rightColumn
                }
            </div>

            <div className="board bottom-row container">
                {
                    this.bottomRow
                }
            </div>
        </BaseContainer>
    }
}

export { Board };