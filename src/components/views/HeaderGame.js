import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import {api, handleError} from "../../helpers/api";
import {useHistory, useParams} from "react-router-dom";
import Stomper from "../../helpers/Stomp";

const HeaderGame = (props) => {
    const history = useHistory();
    const params = useParams();
    const username = JSON.parse(sessionStorage.getItem('token')).username;
    const gameId = sessionStorage.getItem("gameId");
    
    const [hasTurn, setHasTurn] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null);

    let webSocket = Stomper.getInstance();

    // join the specific topic for the HeaderGame
    webSocket.join("/topic/games/" + params.id + "/newturn_gameheader", receiveNewTurn);

    function receiveNewTurn(message) {
        console.log("receiveNewTurn start ...");

        const receivedTurn = JSON.parse(message.body);

        if (receivedTurn !== null) {
            console.log("receivedTurn is not null");
            console.log(receivedTurn);

            console.log("set hasTurn");
            setHasTurn(true);

            console.log("set currentTurn")
            setCurrentTurn(receivedTurn);
        }
    }

    const Player = ({ player }) => {
        const pc = player.playerColor;
        return (
            <div className="header playername" style={{background: pc}} >
                <div>{player.playerName}</div>
            </div>
        );
      };


    const popUpLeave = async () => {
        if (window.confirm("Do you want to leave the game?")) {
            try {
                webSocket.leave("/topic/games/" + gameId + "/gamestart");
                webSocket.leave("/topic/games/" + gameId + "/newturn");
                webSocket.leave("/topic/games/" + gameId + "/updatedturn");
                webSocket.leave("/topic/games/" + gameId + "/scoreboard");
                webSocket.leave("/topic/games/" + gameId + "/barrierquestion");
                webSocket.leave("/topic/games/" + gameId + "/gameover");
                // set status to offline
                await api.delete(
                    `/games/${gameId}`,
                    {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
                );
                console.log("Left game");
                sessionStorage.removeItem("gameId");

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
            <h2 className="header game username">{username}</h2>
            {(hasTurn && currentTurn !== null) ? (
                <div className="header playerlist">
                    {/* <div className="header playername">one</div> */}
                    {/* <div className="header playername">two</div> */}
                    {currentTurn.turnPlayers.map((p) => (<Player player={p} key={p.id}/>))}
                </div>
            ) : (
                <div className="home lobby-container">
                    no turn received yet
                </div>
            )}
            <div className="header game round-counter">
                {(hasTurn && currentTurn !== null) ? (
                    <div> Round {currentTurn.turnNumber} </div>
                ) : (
                    <div> no round counter </div>
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
