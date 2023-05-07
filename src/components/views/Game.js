import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "../ui/CountryRanking";
import { TurnScoreboard } from 'components/ui/TurnScoreboard';
import Stomper from 'helpers/Stomp';
import Player from "../../models/Player";
import Barrier from "../ui/Barrier";
import { WinnerScreen } from 'components/ui/WinnerScreen';

// TODO: When a player leaves the game, players should be updated otherwise the answering cannot be done

const Game = props => {
    const params = useParams();
    const userToken = JSON.parse(sessionStorage.getItem('token')).token;

    let webSocket = Stomper.getInstance();
    webSocket.leave("/topic/games/" + params.id + "/lobby");
    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setShowTurnScoreboard(false);
        setShowBarrier(false);
        console.log("newturn information")
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);

        setPlayers(JSON.parse(message.body).turnPlayers);
        setGameJustStarted(false);
    });
    webSocket.join("/topic/games/" + params.id + "/nextTurn", function (message) {
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
        // setTurnResults(JSON.parse(message.body).scoreboardEntries)
        console.log("showing scoreboard");
        setShowTurnScoreboard(true);
    });
    webSocket.join("/topic/games/" + params.id + "/scoreboardOver", function (message) {
        console.log("remove scoreboard and move players");
        setShowTurnScoreboard(false);
        setTurnResults(JSON.parse(message.body).scoreboardEntries)
        
        
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {
        setShowTurnScoreboard(false);
        setShowCountryRanking(false);
        setBarrierProps(JSON.parse(message.body));
        setShowBarrier(true);
    });
    webSocket.join("/topic/games/" + params.id + "/barrierHit", function (message) {
        console.log(JSON.parse(message.body));
        setBarrierHit(JSON.parse(message.body));
    });
    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {
        setShowWinnerScreen(true);
        setWinnerScreenProps(JSON.parse(message.body));
    });

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    const [showWinnerScreen, setShowWinnerScreen] = useState(false);
    const [winnerScreenProps, setWinnerScreenProps] = useState({});

    const [showBarrier, setShowBarrier] = useState(false);
    const [barrierProps, setBarrierProps] = useState({});

    const [turnResults, setTurnResults] = useState(null);
    const [barrierHit, setBarrierHit] = useState(null);
    const [players, setPlayers] = useState(null);
    const [movedFields, setMovedFields] = useState(null);
    const [gameJustStarted, setGameJustStarted] = useState(true);

    

    const thisBoard = (
        <Board
            ref={React.createRef()}
            gameId={params.id}
            numPlayers={3}
            withBarriers={true}
            boardLayout={"large"}
        />
    )

    useEffect( () => {
        /**
         * callback to add the players to the board at the beginning of the game
         */
        if (players === null){
            return;
        }
        if (!gameJustStarted) {
            return;
        }

        let counter = 0;
        let mover;
        let fieldTracker = {};
        while (counter < players.length) {
            mover = new Player(players[counter]);
            thisBoard.ref.current.addPlayer(mover, 46);
            fieldTracker[mover.playerName] = 46;
            counter += 1;
        }
        console.log("filed tracker:");
        console.log(fieldTracker);
        setMovedFields(fieldTracker);


    }, [players])

    useEffect(async () => {
        /**
         * callback to move players at the end of turn
         */
        if (turnResults === null) {
            return
        }
        const board = thisBoard.ref.current;
        const end = board.boardParams[5];
        const allowBarriers = board.withBarriers;

        // pick first player from round who can send nextTurn
        const playerAllowedToContinue = new Player(players[0]);

        let moverIndex = 0;
        let mover;
        let counter;
        while (moverIndex < turnResults.length) {
            mover = new Player(turnResults[moverIndex]);
            counter = 0;
            while (counter < turnResults[moverIndex].currentScore) {
                webSocket.send(`/app/games/${params.id}/player/${mover.playerId}/moveByOne`);
                counter += 1;
            }
            await board.movePlayer(mover, movedFields[mover.playerName], turnResults[moverIndex].currentScore, end, allowBarriers);
            movedFields[mover.playerName] += turnResults[moverIndex].currentScore;

            moverIndex += 1;
        }


        // If the client is the player allowed to continue, wait and send
        if (userToken === playerAllowedToContinue.userToken) {
            setTimeout(() => {
                webSocket.send(`/app/games/${params.id}/nextTurn`, {message: `Player ${userToken} : nextTurn`})
            }, "2000");
            
        }
    }, [turnResults]);


    useEffect( () => {
        //callback for barriers

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

    return (
        <BaseContainer className="game container">
            {thisBoard}
            {showCountryRanking && <CountryRanking {...countryRankingProps} />
            }
            {showTurnScoreboard && <TurnScoreboard {...turnScoreboardProps} />
            }
            {showBarrier && <Barrier {...barrierProps} />
            }
            {showWinnerScreen && <WinnerScreen {...winnerScreenProps} />
            }

        </BaseContainer>
    );
}

export default Game;