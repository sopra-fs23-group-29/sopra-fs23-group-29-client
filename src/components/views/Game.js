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
    const history = useHistory();

    // Variable to change right now

    let change = "Barrier"

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


    // TODO: Put next three ifs in components
    if (change === "Countries popping up") {

        content = (
            <BaseContainer className="middle countries container">
                <h2>Category: {category}</h2>
                <p>When it's your turn, click on a country and
                    a number to rank the country in relation to
                    the other countries. Each country can only be chosen once.</p>
                <div className="middle countries flag-rows">
                    <div className="middle countries flag-container">Switzerland</div>
                    <div className="middle countries flag-container">Switzerland</div>
                    <div className="middle countries flag-container">Switzerland</div>
                </div>
                <div className="middle countries flag-rows">
                    <div className="middle countries flag-container">Switzerland</div>
                    <div className="middle countries flag-container">Switzerland</div>
                    <div className="middle countries flag-container">Switzerland</div>
                </div>
                <div className="middle countries bottom-row">
                    <div>[ COUNTDOWN ]</div>
                    <div className="middle countries number-row">
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


    return (
        <BaseContainer className="game container">
            <Board>

            </Board>
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
