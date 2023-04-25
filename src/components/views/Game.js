import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "../ui/CountryRanking";
import { TurnScoreboard } from 'components/ui/TurnScoreboard';
import Stomper from 'helpers/Stomp';
import {Button} from "../ui/Button";


const Game = props => {
    const history = useHistory();
    const params = useParams();
    let webSocket = Stomper.getInstance();
    webSocket.leave("/topic/games/" + params.id + "/lobby", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);
    });
    webSocket.join("/topic/games/" + params.id + "/updatedturn", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/scoreboard", function (message) {
        setShowCountryRanking(false);
        setTurnScoreboardProps(JSON.parse(message.body));

        setShowTurnScoreboard(true);
        setTimeout(() => {
            setShowTurnScoreboard(false);
            //here comes call to board with player and point array
        }, "5000");
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {});

    const thisBoard = (
        <Board
            ref={React.createRef()}
        />
    )
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
            await board.updateColors(fieldsToMove, end, allowBarriers);
            //board.updateColors([1], end, allowBarriers);
            index += 1;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    let roundNumber = 1;
    let content = (
        <BaseContainer className="round container">
            Round {roundNumber}
        </BaseContainer>
    );

    return (
        <BaseContainer className="game container">
            {thisBoard}

            <Button
                onClick={() => simulateGame()}>
                simulate game
            </Button>

            {content}
            {showCountryRanking && <CountryRanking {...countryRankingProps} />}
            {showTurnScoreboard && <TurnScoreboard {...turnScoreboardProps} />}
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