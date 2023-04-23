import {Start, Field, Barrier, End} from "./BoardField";
import React from 'react';
import "styles/views/Board.scss";
import theme from "styles/_theme.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { Gradient } from "helpers/LinearGradient";


export const Board = (props) => {
    let withBarriers = false;
    let gameMode = "pvp-large";
    const containerColor = theme.containerColor;
    const textColor = theme.textColor;

    /**
     * dummy players
     */
    const startFieldColors = ["blue", "red", "green", "yellow", "purple", "orange"];

    const numberOfPlayers = 6;
    const createPlayers = (numPlayers) => {
        let players = [];
        let counter = 0;
        while (counter < numPlayers) {
            players.push({color: startFieldColors[counter], field: 0})
            counter += 1;
        }
        return players;
    }
    const players = createPlayers(numberOfPlayers);

    /**
     * helper functions to locate fields and identify barriers
     */
    const getPlaceOnBoard = (index, parameters) => {
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
            default:
                // pvp-large
                return [0, 5, 15, 20, 30, 29];
        }
    }

    function createColorArray(end, allowBarriers) {
        let colorArray = []
        let index = 0;
        while (index <= end) {
            if (allowBarriers && isBarrier(index, end)) {
                colorArray.push([textColor]);
            } else {
                colorArray.push([containerColor]);
            }
            index += 1;
        }
        // add the players' colors at the start
        colorArray[0].push(...startFieldColors)
        return colorArray;
    }

    function createGradientArray(colorArray, parameters) {
         let gradientArray = [];
         let index = 0;
         let gradient;
         while (index < colorArray.length) {
             //gradient = mixColors(index, colorArray[index], getPlaceOnBoard(index, boardParams));
             gradient = (
                 <Gradient
                    ind={100 + index}
                    colorArray={colors[index]}
                    placeOnBoard={getPlaceOnBoard(index, parameters)}
                    ref={React.createRef()}
                 />)
             gradientArray.push(gradient)
             index += 1;
         }
         return gradientArray;
    }

    function fieldMapper(parameters, allowBarriers, gradients) {
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
                        {gradients[index]}
                    </Start>
                )
            }
            // end
            else if (index === end) {
                fields.push(
                    <End key={index}>
                        {gradients[index]}
                    </End>
                )
            }
            // barriers
            else if (allowBarriers && isBarrier(index, end)) {
                fields.push(
                    <Barrier key={index}>
                        {gradients[index]}
                    </Barrier>
                )
            }
            // normal fields
            else {
                fields.push(
                    <Field key={index}>
                        {gradients[index]}
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
    let globalIndex = 1;
    function simulateGame(numPlayers, index, end) {
        let fieldsToMove = [];
        let player = 0;
        while (player < numPlayers) {
            if (index%player === 0) {
                fieldsToMove.push(player);
            }
            else if (player === 0 && index%5 === 0){
                fieldsToMove.push(5);
            }
            else {
                fieldsToMove.push(0);
            }
            player += 1;
        }
        console.log(fieldsToMove);
        updateColors(fieldsToMove, end);
        globalIndex += 1;
    }

    function updateColors(fieldsMoved, end) {
        let player = 0;
        while (player < fieldsMoved.length) {
            movePlayer(player, fieldsMoved[player], end);
            player += 1;
        }
    }

    function movePlayer(playerNum, numFields, end) {
        const player = players[playerNum];
        const color = player.color;
        const oldField = player.field

        // remove the player from the current field
        const index = colors[oldField].indexOf(color);
        colors[oldField].splice(index, 1);
        gradients[oldField].ref.current.updateColors(colors[oldField]);

        // move the player one field forward
        const newField = Math.min(end, oldField + numFields);
        player.field = newField;
        colors[newField].push(color);
        gradients[newField].ref.current.updateColors(colors[newField]);
    }

    /**
     * create and return the board
     */
    const boardParams = getBoardParams(gameMode);
    const colors = createColorArray(boardParams[5], withBarriers);
    const gradients = createGradientArray(colors, boardParams);

    const fields = fieldMapper(boardParams, withBarriers, gradients);

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
            onClick={() => simulateGame(numberOfPlayers, globalIndex, boardParams[5])}>
            simulate game
        </Button>

    </BaseContainer>
}

Board.propTypes = {
    mode: PropTypes.string,
    onChange: PropTypes.func,
};