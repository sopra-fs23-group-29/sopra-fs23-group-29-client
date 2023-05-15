import React, {useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "../ui/CountryRanking";
import { TurnScoreboard } from 'components/ui/TurnScoreboard';
import Stomper from 'helpers/Stomp';
import Player from "../../models/Player";
import Barrier from "../ui/Barrier";
import { WinnerScreen } from 'components/ui/WinnerScreen';
import { WinnerScreenSoloFar } from 'components/ui/WinnerScreenSoloFar';
import { WinnerScreenSoloFast } from 'components/ui/WinnerScreenSoloFast';
import {api, handleError} from "../../helpers/api";


const Game = props => {

    const params = useParams();
    const history = useHistory();

    const gameId = sessionStorage.getItem("gameId");

    let webSocket = Stomper.getInstance();

    webSocket.leave("/topic/games/" + params.id + "/lobby");

    // Get a message with the created game upon creation of the game
    webSocket.join("/topic/games/" + params.id + "/newgame", function (message) {
        // console.log("Game : newGame information");
        // set the boardSize parameter
        let game = JSON.parse(message.body);
        // console.log(game);
        setNewGame(game);
    });

    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setShowTurnScoreboard(false);
        setShowBarrier(false);
        // console.log("newturn information")
        // todo: how to replace country ranking, so it does not show double?
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
        // console.log("showing scoreboard");
        setShowTurnScoreboard(true);
    });
    webSocket.join("/topic/games/" + params.id + "/scoreboardOver", function (message) {
        // console.log("remove scoreboard and set turnResults");
        setShowTurnScoreboard(false);
    });
    webSocket.join("/topic/games/" + params.id + "/moveByOne", function (message) {
        // console.log("moving by one");
        setShowBarrier(false);
        setPlayerToMove(JSON.parse(message.body));
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {
        setShowTurnScoreboard(false);
        setShowCountryRanking(false);
        setBarrierProps(JSON.parse(message.body));
        setShowBarrier(true);
    });

    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {
        console.log("Gamemode:")
        let parsedMessage = JSON.parse(message.body);
        console.log(parsedMessage.gameMode);
        switch (parsedMessage.gameMode) {
            case "HOWFAR":
                setShowBarrier(false);
                setShowCountryRanking(false);
                setWinnerScreenSoloFarProps(parsedMessage);
                setShowWinnerScreenSoloFar(true);
                break;
            case "HOWFAST":
                setShowBarrier(false);
                setShowCountryRanking(false);
                setWinnerScreenSoloFastProps(parsedMessage);
                setShowWinnerScreenSoloFast(true);
                break;
            case "PVP":
                setWinnerScreenProps(parsedMessage);
                setShowWinnerScreen(true);
                break;
        }
        
    });

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    const [showWinnerScreen, setShowWinnerScreen] = useState(false);
    const [winnerScreenProps, setWinnerScreenProps] = useState({});

    const [showWinnerScreenSoloFar, setShowWinnerScreenSoloFar] = useState(false);
    const [winnerScreenSoloFarProps, setWinnerScreenSoloFarProps] = useState({});

    const [showWinnerScreenSoloFast, setShowWinnerScreenSoloFast] = useState(false);
    const [winnerScreenSoloFastProps, setWinnerScreenSoloFastProps] = useState({});

    const [showBarrier, setShowBarrier] = useState(false);
    const [barrierProps, setBarrierProps] = useState({});

    const [colorArray, setColorArray] = useState(null);
    const [playerToMove, setPlayerToMove] = useState({})
    const [thisBoard, setThisBoard] = useState(null);
    const [newGame, setNewGame] = useState({});

    const leaveGameUnload = async (gameId) => {
        await api.delete(
            `/games/${gameId}`,
            {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
        );
    }

    // onbeforeunload makes sure there is a popup with a warning instead of just executing the reload
    // works on changing url, refresh, close tab and close window
    // NO CUSTOM MESSAGE is possible
    window.onbeforeunload = (event) => {
        const e = event || window.event;
        // Cancel the event
        e.preventDefault();
        if (e) {
            e.returnValue = '';
        }
        return ''; // Legacy method for cross browser support
    };

    // onunload executes the code when the unload actually happens
    window.onunload = (event) => {
        const e = event || window.event;
        // Cancel the event
        e.preventDefault();

        if (e) {

            console.log("delete gameid from sessionStorage before unloading page");
            sessionStorage.removeItem("gameId");

            console.log("sending POST request to leave game with gameId stored in sessionStorage when Game.js was mounted");
            leaveGameUnload(gameId);
            // api.delete(
            //     `/games/${gameId}`,
            //     {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
            // );

            console.log("leaving all websocket channels");
            webSocket.leave("/topic/games/" + gameId + "/gamestart");
            webSocket.leave("/topic/games/" + gameId + "/newgame_gameheader");
            webSocket.leave("/topic/games/" + gameId + "/newturn_gameheader");
            webSocket.leave("/topic/games/" + gameId + "/newgame");
            webSocket.leave("/topic/games/" + gameId + "/newturn");
            webSocket.leave("/topic/games/" + gameId + "/nextTurn");
            webSocket.leave("/topic/games/" + gameId + "/updatedturn");
            webSocket.leave("/topic/games/" + gameId + "/moveByOne");
            webSocket.leave("/topic/games/" + gameId + "/scoreboard");
            webSocket.leave("/topic/games/" + gameId + "/scoreboardOver");
            webSocket.leave("/topic/games/" + gameId + "/barrierHit");
            webSocket.leave("/topic/games/" + gameId + "/barrierquestion");
            webSocket.leave("/topic/games/" + gameId + "/gameover");
            webSocket.leave("/topic/games/" + gameId + "/gameover_gameheader");

            console.log("reroute to /");
            history.push("/");

            e.returnValue = ''; // Legacy method for cross browser support
        }
        return ''; // Legacy method for cross browser support

    };
      

    /*
    assign a Board component to thisBoard
    */
    useEffect( async () => {
        if (newGame === null || Object.keys(newGame).length === 0) {
            // console.log("game null or empty, skip assigning Board parameters");
            return;
        }
        
        if (newGame.boardSize === null) {
            console.log("boardSize null, skip assigning board");
            return;
        }
        
        if (newGame.barriersEnabled === null) {
            console.log("withBarriers null, skip assigning board");
            return;
        }

        // console.log("received new game information:")
        console.log(JSON.stringify(newGame));
        
        const boardSize = newGame.boardSize.toLowerCase();
        const withBarriers = newGame.barriersEnabled;
        const numFields = newGame.boardSizeInt;
        const gameMode = newGame.gameMode;

        setThisBoard(
            <Board
                ref={React.createRef()}
                boardSize={boardSize}
                withBarriers={withBarriers}
                numFields={numFields}
                gameMode={gameMode}
            />
        )
    }, [newGame])

    /*
    place players at the start of the board
     */
    useEffect(async () => {
        if (thisBoard === null) {
            return;
        }

        // update colorArray
        const players = newGame.players;
        const startingColors = thisBoard.ref.current.getColors();
        for (let i = 0; i < players.length; i++) {
            startingColors[0].push(players[i].playerColor)
        }
        setColorArray(startingColors)

        // place players at the start of the board
        const startField = thisBoard.ref.current.gradientsAndBarriers[0];
        startField.ref.current.updateColors(startingColors[0]);
    }, [thisBoard])

    /*
    process an incoming message to move a player
    expected message:
    {'playerId':playerId, 'playerColor':playerColor, 'currentField':currentField}
    */
    useEffect( async () => {

        if (Object.keys(playerToMove).length === 0) {
            return;
        }

        // console.log("Starting moveByOne ...");
        // console.log(playerToMove)

        const board = thisBoard.ref.current;
        const allowBarriers = board.withBarriers;

        let playerIdToMove = playerToMove.playerId;
        let playerColorToMove = playerToMove.playerColor;
        let playerCurrentField = playerToMove.currentField;

        if (playerIdToMove === null || playerCurrentField === null || playerColorToMove === null) {
            return;
        }

        // console.log(`playerIDToMove: ${playerIdToMove} with color ${playerColorToMove} currently at field ${playerCurrentField}`);

        let playerMoving = new Player(playerToMove);

        // send to board the player, and the starting field, moving by 1
        const result = await board.movePlayerOnce(playerMoving, playerCurrentField, colorArray, allowBarriers);
        setColorArray(result);

    }, [playerToMove])

    return (
        <BaseContainer className="game container">
            {
                thisBoard
            }
            {
                showCountryRanking && <CountryRanking {...countryRankingProps} />
            }
            {
                showTurnScoreboard && <TurnScoreboard {...turnScoreboardProps} />
            }
            {
                showBarrier && <Barrier {...barrierProps} />
            }
            {
                showWinnerScreen && <WinnerScreen {...winnerScreenProps} />
            }
            {
                showWinnerScreenSoloFar && <WinnerScreenSoloFar {...winnerScreenSoloFarProps} />
            }
            {
                showWinnerScreenSoloFast && <WinnerScreenSoloFast {...winnerScreenSoloFastProps} />
            }

        </BaseContainer>
    );
}

export default Game;