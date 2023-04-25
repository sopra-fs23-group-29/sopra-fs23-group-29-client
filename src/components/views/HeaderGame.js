import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import {api, handleError} from "../../helpers/api";
import {useHistory, useParams} from "react-router-dom";
import Stomper from "../../helpers/Stomp";

const HeaderGame = props => {
    const history = useHistory();
    const username = JSON.parse(sessionStorage.getItem('token')).username;
    console.log(username)
    const gameId = sessionStorage.getItem("gameId");
    let webSocket = Stomper.getInstance();

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
            {//<p className="header game barrier-counter">[Barrier Counter]</p>
            }
            <p className="header game round-counter">[Round Counter]</p>
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
