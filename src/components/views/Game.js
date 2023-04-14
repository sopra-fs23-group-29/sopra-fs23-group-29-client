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

    let content = <Spinner/>;

    if (0) {

        content = (0
        );
    }

    return (
        <BaseContainer className="game container">
            <h2>Happy Coding!</h2>
        </BaseContainer>
    );
}

export default Game;
