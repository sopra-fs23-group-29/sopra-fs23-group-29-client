import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "./CountryRanking";


const Game = props => {
    const history = useHistory();

    async function simulateGame() {
        console.log("started simulation");
        const board = thisBoard.ref.current;
        const numPlayers = board.numberOfPlayers;
        const end = board.boardParams[5];
        const allowBarriers = board.withBarriers;

        let index = 0;
        let fieldsToMove = [];
        while (index <= 18) {
            // reset
            let player = 0;
            fieldsToMove = [];
            // simulate next turn
            while (player < numPlayers) {
                if (index % player === 0) {
                    fieldsToMove.push(player);
                } else if (player === 0) {
                    fieldsToMove.push(index % 3);
                } else {
                    fieldsToMove.push(0);
                }
                player += 1;
            }
            board.updateColors(fieldsToMove, end, allowBarriers);
            //board.updateColors([1], end, allowBarriers);
            index += 1;
            await new Promise(r => setTimeout(r, 200));
        }
    }
    const thisBoard = (
        <Board
            ref={React.createRef()}
        />
    )
    // Variable to change right now

    let change = "Score"

    // Round counter
    let roundNumber = 1
    let content = (
        <BaseContainer className="round container">
            Round {roundNumber}
        </BaseContainer>);

    //const roundTimeout = setTimeout(content, 1000);

    // End Turn
    const endTurn = () => {
        // dummy
        history.push("/users");
    };

    // Countries popping up
    let category = "Population"
    let playerNumber = 4
    let countries = "Switzerland"

    /*

    if (change ==="Score") {

        content = (
            <BaseContainer className="middle score container">
                <h3>Category: {category}</h3>
                <h2>Turn Result</h2>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">1.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
                <hr className="divider"></hr>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">2.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
                <hr className="divider"></hr>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">3.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
                <hr className="divider"></hr>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">4.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
                <hr className="divider"></hr>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">5.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
                <hr className="divider"></hr>
                <div className="middle score score-rows">
                    <div className="middle score country-rank">6.</div>
                    <div className="middle score score-flag">[FLAG]</div>
                    <div className="middle score country-name">[COUNTRY]</div>
                    <div className="middle score number-by-player">[NUMBER GIVEN BY PLAYER]</div>
                    <i className="middle score score-icon">arrow_right</i>
                    <div className="middle score points-received">Points: X</div>
                    <div className="middle score stats">[STATS]</div>
                </div>
            </BaseContainer>
        );
    }

    Barrier
    if (change ==="Barrier") {

        content = (
            <BaseContainer className="middle barrier container">
                <h2>[BARRIER QUESTION]</h2>

                <Button>
                    OK
                </Button>
            </BaseContainer>
        );
    }
    */

    return (
        <BaseContainer className="game container">
            {thisBoard}

            <Button
                onClick={() => simulateGame()}>
                simulate game
            </Button>
            {content}
            <BaseContainer className="order container">
                <div>Username 1</div>
                <div>Username 2</div>
                <div>Username 3</div>
                <div>Username 4</div>
                <div>Username 5</div>
                <div>Username 6</div>
            </BaseContainer>
        </BaseContainer>
    );
}

export default Game;
