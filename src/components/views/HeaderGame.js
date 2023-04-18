import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import {api, handleError} from "../../helpers/api";
import {useHistory, useParams} from "react-router-dom";
import Stomper from "../../helpers/Stomp";

const HeaderGame = props => {
    const history = useHistory();
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();

    const popUpLeave = async () => {
        if (window.confirm("Do you want to leave the game?")) {
            try {
                // set status to offline
                await api.delete(
                    `/games/${gameId}`,
                    {},
                    {headers: {"Authorization": JSON.parse(localStorage.getItem('token')).token}}
                );

            } catch (error) {
                console.log(`Something went wrong when leaving the game: \n${handleError(error)}`);
            }

            // remove websocket connection
            webSocket.leave(`/games/${gameId}`)

            // redirect to home
            history.push('/');

        }
    }

    return (
        <div className="header container" style={{height: props.height}}>
            <Globalissimo/>
            <h2 className="header game username">[USERNAME]</h2>
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
