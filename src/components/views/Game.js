import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";


const Game = props => {
    const history = useHistory();

    let roundNumber = 1
    let content = (
        <BaseContainer className="round container">
            Round {roundNumber}
        </BaseContainer>);

    if (0) {

        content = (
            <BaseContainer className="middle container">
                <h2>Happy Coding!</h2>
            </BaseContainer>
        );
    }

    return (
        <BaseContainer className="game container">
            {content}
        </BaseContainer>
    );
}

export default Game;
