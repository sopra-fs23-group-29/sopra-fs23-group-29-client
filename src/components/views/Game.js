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

// TODO : Board constructor should take boardSize as an argument

const Game = props => {

    const params = useParams();

    let webSocket = Stomper.getInstance();

    webSocket.leave("/topic/games/" + params.id + "/lobby");

    // Get a message with the created game upon creation of the game
    webSocket.join("/topic/games/" + params.id + "/newgame", function (message) {
        console.log("newgame information");
        // set the boardsize parameter
        let game = JSON.parse(message.body);
        console.log(`newgame game.boardSize: ${game.boardSize.toLowerCase()}`);
        console.log(`newgame game.boardSize: ${game.boardSizeInt}`);
        setBoardsize(game.boardSize.toLowerCase());
        setBoardsizeInt(game.boardSizeInt);
    });

    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setShowTurnScoreboard(false);
        setShowBarrier(false);
        console.log("newturn information")
        // todo: how to replace country ranking, so it does not show double?
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);

        setPlayers(JSON.parse(message.body).turnPlayers);
        setGameJustStarted(false);
    });

    // TOOD : Channel /nextTurn does not exist anymore, can be removed?
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
        console.log("remove scoreboard and set turnResults");
        setShowTurnScoreboard(false);
    });
    webSocket.join("/topic/games/" + params.id + "/moveByOne", function (message) {
        console.log("moving by one");
        setPlayerToMove(JSON.parse(message.body));
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {
        setShowTurnScoreboard(false);
        setShowCountryRanking(false);
        setBarrierProps(JSON.parse(message.body));
        setShowBarrier(true);
    });
    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {});

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    const [showBarrier, setShowBarrier] = useState(false);
    const [barrierProps, setBarrierProps] = useState({});

    const [turnResults, setTurnResults] = useState(null);
    const [barrierHit, setBarrierHit] = useState(null); // todo: remove?
    const [players, setPlayers] = useState(null);
    const [movedFields, setMovedFields] = useState(null);
    const [gameJustStarted, setGameJustStarted] = useState(true);
    const [playerToMove, setPlayerToMove] = useState({})

    const [boardsize, setBoardsize] = useState(null)
    const [boardsizeInt, setBoardsizeInt] = useState(null)

    const thisBoard = (
        <Board
            ref={React.createRef()}
            gameId={params.id}
            numPlayers={3}
            withBarriers={true}
            boardLayout={"small"}
        />
    )

    /*
    process an incoming message to move a player
    expected message:
    {'playerId':playerId, 'currentField':currentField}
    */
    useEffect( async () => {
        
        if (Object.keys(playerToMove).length === 0) {
            return;
        }
        
        console.log("Starting moveByOne ...");
        console.log(playerToMove)

        const board = thisBoard.ref.current;
        const end = board.boardParams[5];
        const allowBarriers = board.withBarriers;

        let playerIdToMove = playerToMove.playerId;
        let playerCurrentField = playerToMove.currentField;

        if (playerIdToMove === null || playerCurrentField === null) {
            return;
        }

        console.log(`playerIDToMove: ${playerIdToMove} currently at field ${playerCurrentField}`);

        let playerMoving = new Player(playerIdToMove);
        // send to board the player, and the starting field, moving by 1
        board.movePlayer(playerMoving, playerCurrentField, 1, end, allowBarriers);

    }, [playerToMove])

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
            thisBoard.ref.current.addPlayer(mover, 0);
            fieldTracker[mover.playerName] = 0;
            counter += 1;
        }
        setMovedFields(fieldTracker);

    }, [players])


    useEffect( () => {
        //callback for barriers

        // DEBUG, remove later
        console.log(`barrierHit ${barrierHit} - do nothing`)

        // // console.log(barrierHit)
        // if (barrierHit === null) {
        //     return
        // }
        // if (barrierHit === false) {
        //     const board = thisBoard.ref.current;
        //     const end = board.boardParams[5];
        //     const allowBarriers = board.withBarriers;

        //     const mover = new Player(turnResults[0]);
        //     board.movePlayerOnce(mover, end, allowBarriers);
        // }
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

        </BaseContainer>
    );
}

export default Game;