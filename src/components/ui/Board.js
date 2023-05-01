import {Start, Field, End, Barrier} from "./BoardField";
import React from 'react';
import "styles/ui/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Gradient } from "components/ui/LinearGradient";


class Board extends React.Component {
    withBarriers = false;
    boardLayout = "large";
    containerColor = theme.containerColor;
    textColor = theme.textColor;

    /**
     * create players
     */
    addPlayer(player, field){
        const name = player.playerName;
        const color = player.playerColor;
        console.log(`added player with name: ${name} on field ${field}`);

        // add the color to the board if not already present
        console.log(this.colors[field]);
        if (this.colors[field].indexOf(color) === -1){
            this.colors[field].push(color);
            this.gradientsAndBarriers[field].ref.current.updateColors(this.colors[0]);
        }
        //console.log(`playerFields[${player.playerName}] = ${this.playerFields[name]}`);
    }

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
    getBoardParams(layout){
        switch (layout) {
            case "small":
                return [0, 3, 8, 11, 16, 15];
            case "medium":
                return [0, 5, 15, 20, 30, 29];
            case "large":
                return [0, 7, 24, 31, 48, 47];
            case "gigantic":
                return [0, 8, 28, 36, 56, 55];
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
        // add the players' colors at the start
        // colorArray[0].push(...this.startFieldColors);
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
    async movePlayer(player, startingField, fieldsToMove, end, allowBarriers) {
        console.log(`moving player ${player.playerName} with color ${player.playerColor} ${fieldsToMove} fields.`);
        const color = player.playerColor;
        /*
        if (this.playerFields[player.playerName] === undefined){
            this.addPlayer(player, startingField);
        }
         */
        const oldField = startingField;
        console.log(oldField, color);

        // remove the player from the current field
        const index = this.colors[oldField].indexOf(color);
        this.colors[oldField].splice(index, 1);
        this.gradientsAndBarriers[oldField].ref.current.updateColors(this.colors[oldField]);

        // move the player one field forward
        let newField = Math.min(end, oldField + fieldsToMove);

        if (allowBarriers && this.isBarrier(newField, end)) {
            const barrier = this.gradientsAndBarriers[newField].ref.current
            // we need to skip barriers and clear them if they were not already cleared
            if (!barrier.isCleared()) {
                barrier.clearBarrier(color);
            }
            newField = Math.min(end, newField + 1);
        }

        player.field = newField;
        this.colors[newField].push(color);
        this.gradientsAndBarriers[newField].ref.current.updateColors(this.colors[newField]);

        await new Promise(r => setTimeout(r, 200));
        return newField;
    }

    /*
    movePlayerOnce(player, end, allowBarriers) {
        console.log(`moving player ${player.playerName} with color ${player.playerColor}`);
        const color = player.playerColor;
        if (this.playerFields[player.playerName] === undefined){
            this.addPlayer(player);
        }
        const oldField = this.playerFields[player.playerName];

        // remove the player from the current field
        const index = this.colors[oldField].indexOf(color);
        this.colors[oldField].splice(index, 1);
        this.gradientsAndBarriers[oldField].ref.current.updateColors(this.colors[oldField]);

        // move the player one field forward
        let newField = Math.min(end, oldField + 1);
        if (allowBarriers && this.isBarrier(newField, end)) {
            const barrier = this.gradientsAndBarriers[newField].ref.current
            // we need to skip barriers and clear them if they were not already cleared
            if (!barrier.isCleared()) {
                barrier.clearBarrier(color);
            }
            newField = Math.min(end, newField + 1);
        }
        player.field = newField;
        this.colors[newField].push(color);
        this.gradientsAndBarriers[newField].ref.current.updateColors(this.colors[newField]);
        //await new Promise(r => setTimeout(r, 200));
    }
     */

    /**
     * create and return the board
     */
    boardParams = this.getBoardParams(this.boardLayout);
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
                    // bottom to top, hence reverse()
                    this.leftColumn
                }
            </div>

            <div className="board top-row container">
                {
                    // left to right
                    this.topRow
                }
            </div>

            <div className="board right-column container">
                {
                    // top to bottom
                    this.rightColumn
                }
            </div>

            <div className="board bottom-row container">
                {
                    // right to left, hence reverse()
                    this.bottomRow
                }
            </div>
        </BaseContainer>
    }
}

export { Board };