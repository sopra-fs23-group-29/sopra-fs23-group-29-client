import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "../ui/CountryRanking";
import { TurnScoreboard } from 'components/ui/TurnScoreboard';
import Stomper from 'helpers/Stomp';
import Player from "../../models/Player";


const Game = props => {
    const history = useHistory();
    const params = useParams();
    let webSocket = Stomper.getInstance();
    webSocket.leave("/topic/games/" + params.id + "/lobby");
    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);
    });
    webSocket.join("/topic/games/" + params.id + "/updatedturn", function (message) {
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);
    });
    webSocket.join("/topic/games/" + params.id + "/scoreboard", function (message) {
        setShowCountryRanking(false);
        setTurnScoreboardProps(JSON.parse(message.body));
        console.log("showing scoreboard");
        console.log(JSON.parse(message.body));
        setShowTurnScoreboard(true);
        setTurnResults(JSON.parse(message.body).scoreboardEntries)
        setTimeout(() => {
            setShowTurnScoreboard(false);
            //here comes call to board to walk players. just pass JSON.parse(message.body) . The information to move the players is in there
        }, "1000");
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/barrierHit", function (message) {
        console.log(JSON.parse(message.body));
        setBarrierHit(JSON.parse(message.body));
    });
    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {});

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    const [turnResults, setTurnResults] = useState(null);
    const [barrierHit, setBarrierHit] = useState(null);

    const thisBoard = (
        <Board
            ref={React.createRef()}
            gameId={params.id}
            numPlayers={3}
            withBarriers={true}
            boardLayout={"large"}
        />
    )

    useEffect(() => {
        console.log(turnResults)
        if (turnResults === null) {
            return
        }
        const board = thisBoard.ref.current;
        const end = board.boardParams[5];
        const allowBarriers = board.withBarriers;

        let moverIndex = 0;
        let mover;
        while (moverIndex < turnResults.length) {
            mover = new Player(turnResults[moverIndex]);
            board.movePlayer(mover, turnResults[moverIndex].currentScore, end, allowBarriers);
            moverIndex += 1;
        }

        //console.log(mover);
        //webSocket.send(`/games/${params.id}/player/${mover.playerId}/moveByOne`);
    }, [turnResults]);

    /*
    useEffect( () => {
        console.log(barrierHit)
        if (barrierHit === null) {
            return
        }
        if (barrierHit === false) {
            const board = thisBoard.ref.current;
            const end = board.boardParams[5];
            const allowBarriers = board.withBarriers;

            const mover = new Player(turnResults[0]);
            board.movePlayerOnce(mover, end, allowBarriers);
        }
    }, [barrierHit]);
         */

    sessionStorage.setItem('game', JSON.stringify({
            "turnNumber": 1,
            "playerColor": "NOTSET",
        }
    ));
    let content = (
        <BaseContainer className="round container">
            Round {JSON.parse(sessionStorage.getItem("game")).turnNumber}
        </BaseContainer>
    );

    return (
        <BaseContainer className="game container">
            {thisBoard}

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