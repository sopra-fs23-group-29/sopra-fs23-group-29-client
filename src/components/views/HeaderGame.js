import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import { CountdownTimer, Timer }from "../ui/Countdown";
import {api, handleError} from "../../helpers/api";
import {useHistory, useParams} from "react-router-dom";
import Stomper from "../../helpers/Stomp";
import theme from "styles/_theme.scss";

// todo: When a player leaves the game, players should be updated otherwise the answering cannot be done

const HeaderGame = (props) => {

    const history = useHistory();
    const params = useParams();
    const username = JSON.parse(sessionStorage.getItem('token')).username;
    const gameId = sessionStorage.getItem("gameId");
    
    const [hasTurn, setHasTurn] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null);
    const [showPlayers, setShowPlayers] = useState(true);
    const [yourPlayerColor, setYourPlayerColor] = useState(theme.textColor);

    const [gamemode, setGamemode] = useState("");
    const [hasCountdown, setHasCountdown] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [hasTimer, setHasTimer] = useState(false);
    const [timer, setTimer] = useState(null);

    let webSocket = Stomper.getInstance();

    // join the /newgame topic for the HeaderGame
    webSocket.join("/topic/games/" + params.id + "/newgame_gameheader", receiveNewGame);

    // join the specific topic for the HeaderGame
    webSocket.join("/topic/games/" + params.id + "/newturn_gameheader", receiveNewTurn);
    
    // join the topioc about the game ending
    webSocket.join("/topic/games/" + params.id + "/gameover_gameheader", receiveGameover);

    function receiveNewGame(message) {
        // console.log("GameHeader : received newgame information");
        // console.log(JSON.parse(message.body));
        const game = JSON.parse(message.body);

        if (game.gameMode !== null && game.gameMode !== "PVP") {
            setGamemode(game.gameMode);
        }

        if (game !== null) {
            
            // if the game is not PVP do not show the players
            if (game.gameMode !== "PVP") {
                setShowPlayers(false);
            }

            if (game.gameMode === "HOWFAR") {

                setHasCountdown(true);
                const NOW_IN_MS = new Date().getTime();

                // Correct implementation of countdown, depending on game.maxDuration
                const OVER_IN_MS = game.maxDurationInt*60*1000;
                
                // DEBUG - Set a short countdown
                // const OVER_IN_MS = 5000; // 5 seconds to check timeUp functionality
                
                const TARGET_DATETIME = NOW_IN_MS + OVER_IN_MS

                setCountdown(<CountdownTimer targetDate = {TARGET_DATETIME} gameId = {gameId}/>)
            }

            if (game.gameMode == "HOWFAST") {
                
                // implement a timer
                const NOW_IN_MS = new Date().getTime();
                setTimer(<Timer start = {NOW_IN_MS}/>)
                
                setHasTimer(true);
            }
        }
    }

    function receiveNewTurn(message) {
        // console.log("received newturn information");

        const receivedTurn = JSON.parse(message.body);

        if (receivedTurn !== null) {
            setHasTurn(true);
            setCurrentTurn(receivedTurn);
        }
    }

    function receiveGameover(message) {setHasTimer(false);}

    const Player = ({ player }) => {
        const pc = player.playerColor;
        if (player.playerName === username) {
            setYourPlayerColor(player.playerColor)
        }
        return (
            <div className="header game playername" style={{background: pc}}>
                {player.playerName}
            </div>
        );
      };


    const popUpLeave = async () => {
        if (window.confirm(`
Do you want to leave the game?
WARNING: You will not be able to rejoin a running game, leaving is final!

The game will continue for the other players unless the last player of the game leaves the game.
If you are the last player of the game and leave, the game will be shut down and deleted.`
        )) {
            try {
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
                // set status to offline
                await api.delete(
                    `/games/${gameId}`,
                    {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
                );
                console.log("Left game");
                sessionStorage.removeItem("gameId");
                sessionStorage.removeItem('game');

                // redirect to home
                history.push('/');
            } catch (error) {
                console.log(`Something went wrong when leaving the game: \n${handleError(error)}`);
            }
        }
    }

    return (
        <div className="header container" style={{height: props.height}}>
            <Globalissimo/>

            <h2 className="header game username" style={{color: yourPlayerColor}}>{username}</h2>

            {(gamemode !== "") ? (<h2 className="header game gamemode">{gamemode}</h2>) : (<div/>) }

            {(hasCountdown) ? (countdown) : (<div/>)}
            
            {(hasTimer) ? (timer) : (<div/>)}
            
            {(hasTurn && showPlayers && currentTurn !== null) ? (
                <div className="header game playerlist">
                    {currentTurn.turnPlayers.map((p) => (<Player player={p} key={p.id}/>))}
                </div>
            ) : (
                <div/>
            )}

            <div className="header game round-counter">
                {(hasTurn && currentTurn !== null) ? (
                    <div style={{width: "5em"}}> Round {currentTurn.turnNumber} </div>
                ) : (
                    <div className="header game round-counter"/>
                )}
            </div>

            <i className="header game icon" onClick={() => popUpLeave()}>logout</i>
        </div>
    );
};

HeaderGame.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderGame;
