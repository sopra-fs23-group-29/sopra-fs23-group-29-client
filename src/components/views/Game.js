import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {Board} from "./Board";


const Game = props => {
    const board = new Board(10);
    const history = useHistory();

    // Variable to change right now

    let change = "Countries popping up"

    // Round counter
    let roundNumber = 1
    const roundTimeout = setTimeout(content, 1000);
    let content = (
        <BaseContainer className="round container">
            Round {roundNumber}
        </BaseContainer>);

    // End Turn
    const endTurn = () => {
        // dummy
        history.push("/users");
    };

    // Countries popping up
    let category = "Population"
    let playerNumber = 4

    if (change ="Countries popping up") {

        content = (
            <BaseContainer className="middle container">
                <h2>Category: {category}</h2>
                <p>When it's your turn, click on a country and
                    a number to rank the country in relation to
                    the other countries. Each country can only be chosen once.</p>
                <div className="middle flag-rows">
                    <div className="middle flag-container">Switzerland</div>
                    <div className="middle flag-container">Switzerland</div>
                    <div className="middle flag-container">Switzerland</div>
                </div>
                <div className="middle flag-rows">
                    <div className="middle flag-container">Switzerland</div>
                    <div className="middle flag-container">Switzerland</div>
                    <div className="middle flag-container">Switzerland</div>
                </div>
                <div className="middle bottom-row">
                    <div>[ COUNTDOWN ]</div>
                    <div className="middle number-row">
                        <Button className="rank">
                            1
                        </Button>
                        <Button className="rank">
                            2
                        </Button>
                        <Button className="rank">
                            3
                        </Button>
                        <Button className="rank">
                            4
                        </Button>
                        <Button className="rank">
                            5
                        </Button>
                        <Button className="rank">
                            6
                        </Button>
                    </div>
                    <Button onClick={() => endTurn()}>
                        End Turn
                    </Button>
                </div>
            </BaseContainer>
        );
    }


    return (
        <BaseContainer className="game container">
            {board.displayBoard()}
            {content}
        </BaseContainer>
    );
}

export default Game;
