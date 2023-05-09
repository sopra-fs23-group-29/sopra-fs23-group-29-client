import {Start, Field, End, Barrier} from "./BoardField";
import React from 'react';
import "styles/ui/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Gradient } from "components/ui/LinearGradient";


class Board extends React.Component {

    withBarriers = this.props.withBarriers;
    boardSize = this.props.boardSize; // setting the board with the props passed by Game.js
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
        console.log(`getBoardParams: ${size}`);
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
        let index = 0;
        while (index <= end) {
            if (allowBarriers && this.isBarrier(index, end)) {
                colorArray.push([this.textColor]);
            } else {
                colorArray.push([this.containerColor]);
            }
            index += 1;
        }
        return colorArray;
    }

    createGradientAndBarrierArray(colorArray, parameters, allowBarriers) {
        let gradientAndBarrierArray = [];
        let index = 0;
        let gradient;
        let barrier;
        let end = parameters[5];

        while (index < colorArray.length) {
            if (allowBarriers && this.isBarrier(index, end)) {
                barrier = (
                    <Barrier
                        color={this.textColor}
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
            index += 1;
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
    addPlayer(player, field){
        const color = player.playerColor;
        console.log(`added player with color: ${color} on field ${field}`);

        try {
            this.gradientsAndBarriers[field].ref.current.getColors();
        } catch {
            console.log("error");
        }

        // add the color to the board if not already present
        if (this.colors[field].indexOf(color) === -1){
            this.colors[field].push(color);
            this.gradientsAndBarriers[field].ref.current.updateColors(this.colors[0]);
        }
    }

    async movePlayerOnce(player, startingField, end, allowBarriers) {
        // console.log(`movePlayer : PlayerColor ${player.playerColor}`);
        const color = player.playerColor;

        /**
         * handle starting field
         */
        this.addPlayer(player, startingField);

        console.log(this.colors[startingField]);
        console.log(this.gradientsAndBarriers[startingField].ref.current.getColors());

        // remove the player from the current field
        if (allowBarriers && this.isBarrier(startingField, end)) {
            console.log("player was on barrier, do nothing");
        } else {
            const index = this.colors[startingField].indexOf(color);
            this.colors[startingField].splice(index, 2);
            this.gradientsAndBarriers[startingField].ref.current.updateColors(this.colors[startingField]);
        }

        /**
         * handle ending field
         */
        // move the player one field forward
        let endingField = Math.min(end, startingField + 1);
        if (allowBarriers && this.isBarrier(endingField, end)) {
            const barrier = this.gradientsAndBarriers[endingField].ref.current
            // we need to clear barriers if they aren't already
            if (!barrier.isCleared()) {
                barrier.clearBarrier(color);
            }
        } else {
            this.colors[endingField].push(color);
            this.gradientsAndBarriers[endingField].ref.current.updateColors(this.colors[endingField]);
        }

        await new Promise(r => setTimeout(r, 200));
        return endingField;
    }

    /**
     * create and return the board
     */
    boardParams = this.getBoardParams(this.boardSize);
    colors = this.createColorArray(this.boardParams[5], this.withBarriers);
    gradientsAndBarriers = this.createGradientAndBarrierArray(this.colors, this.boardParams, this.withBarriers);
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