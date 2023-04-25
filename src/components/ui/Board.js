import {Start, Field, End, Barrier} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Gradient } from "components/ui/LinearGradient";


class Board extends React.Component {
    withBarriers = true;
    gameMode = "pvp-large";
    containerColor = theme.containerColor;
    textColor = theme.textColor;

    /**
     * dummy players
     */
    startFieldColors = ["blue", "red", "green", "yellow", "purple", "orange"];

    numberOfPlayers = 6;
    createPlayers(numPlayers){
        let players = [];
        let counter = 0;
        while (counter < numPlayers) {
            players.push({color: this.startFieldColors[counter], field: 0})
            counter += 1;
        }
        return players;
    }
    players = this.createPlayers(this.numberOfPlayers);

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
    getBoardParams(mode){
        switch (mode) {
            case "pvp-large":
                return [0, 5, 15, 20, 30, 29];
            case "pvp-small":
                this.withBarriers = false;
                return [0, 3, 8, 11, 16, 15];
            case "gigantic":
                return [0, 8, 28, 36, 56, 55];
            default:
                // pvp-large
                return [0, 5, 15, 20, 30, 29];
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
        colorArray[0].push(...this.startFieldColors)
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
    async updateColors(fieldsMoved, end, allowBarriers) {
        let player = 0;
        while (player < fieldsMoved.length) {
            await this.movePlayer(player, fieldsMoved[player], end, allowBarriers);
            player += 1;
        }
    }

    async movePlayer(playerIndex, numFields, end, allowBarriers) {
        let fieldsMoved = 0;
        let hitBarrier = false;
        while (fieldsMoved < numFields) {
            hitBarrier = await this.movePlayerOnce(playerIndex, end, allowBarriers);
            fieldsMoved += 1
        }
        await new Promise(r => setTimeout(r, 200));
    }

    async movePlayerOnce(playerIndex, end, allowBarriers) {
        const player = this.players[playerIndex];
        const color = player.color;
        const oldField = player.field

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
        await new Promise(r => setTimeout(r, 200));
    }

    /**
     * create and return the board
     */
    boardParams = this.getBoardParams(this.gameMode);
    colors = this.createColorArray(this.boardParams[5], this.withBarriers);
    gradientsAndBarriers = this.createGradientAndBarrierArray(this.colors, this.boardParams, this.withBarriers);
    fields = this.fieldMapper(this.boardParams, this.withBarriers, this.gradientsAndBarriers);

    leftColumn = this.fields.slice(this.boardParams[0], this.boardParams[1]);
    topRow = this.fields.slice(this.boardParams[1], this.boardParams[2]);
    rightColumn = this.fields.slice(this.boardParams[2], this.boardParams[3]);
    bottomRow = this.fields.slice(this.boardParams[3], this.boardParams[4]);

    render() {
        return <BaseContainer className="board container">
            <div className="board left-column container">
                {
                    // bottom to top, hence reverse()
                    this.leftColumn.reverse()
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
                    this.bottomRow.reverse()
                }
            </div>
        </BaseContainer>
    }
}

Board.propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
};

export { Board };