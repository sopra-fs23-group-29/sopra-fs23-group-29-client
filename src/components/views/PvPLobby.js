import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import "styles/ui/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import Stomper from "../../helpers/Stomp";
import { api, handleError } from "helpers/api";

/* This is the view for an open PvP Game Lobby that displays its name and all players in the lobby  */

const PvPLobby = (props) => {
  const history = useHistory();
  const params = useParams();
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(null);
  const [hasFetchedGame, setHasFetchedGame] = useState(false);
  const [isHost, setIsHost] = useState(false);

  let webSocket = Stomper.getInstance();

  const Players = ({ player }) => {
    const hostTag = player.isHost ? " (Host)" : "";

    return (
      <div className="lobby second-container" width="30%">
        <div>{player.playerName + hostTag}</div>
      </div>
    );
  };

  useEffect(() => {
    async function fetchData() {
      /* get gameId */
      const gameId = params.id;

      /* subscribe to topic/games/{gameId}/lobby */
      webSocket.join("/topic/games/" + gameId + "/lobby", getGameInfo);

      /* subscribe to topic/games/{gameId}/gamestart to get an update if the game starts */
      webSocket.join(`/topic/games/${gameId}/gamestart`, gameHasStarted);

      /* subscribe to topic/games/{gameId}/gamedeleted to get an update if the game is deleted due to host leaving */
      webSocket.join(`/topic/games/${gameId}/gamedeleted`, gameHasEnded);

      /* Get the current game */
      webSocket.send("/app/games/" + gameId + "/getGame", {
        message: "GET GAME " + gameId,
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function setAllPlayers() {
      if (game == null) {
        return;
      }
      const plyrs = game.players;
      setPlayers(plyrs);
    }
    setAllPlayers();
  }, [game]);

  // upon change in game, check if I'm the host
  useEffect(() => {
    async function setHost() {
      // when game null set to false
      if (game === null) {
        setIsHost(false);
        return;
      }
      if (game.players === null) {
        setIsHost(false);
        return;
      }

      const token = JSON.parse(sessionStorage.getItem("token")).token;

      // loop through game.players array and check if I'm the host
      let player;
      for (player of game.players) {
        if (player.userToken === token && player.isHost === true) {
          setIsHost(true);
        }
      }
    }
    setHost();
  }, [game]);

  /* get info from websocket message to display players in lobby */
  const getGameInfo = (message) => {
    setGame(JSON.parse(message.body));
    setHasFetchedGame(true);
  };

  // when a message comes in through that channel the game has started, route to /games/gameId
  const gameHasStarted = (message) => {
    const id = params.id;
    // leave all lobby topics
    webSocket.leave(`/topic/games/${id}/lobby`);
    webSocket.leave(`/topic/games/${id}/gamestart`);
    webSocket.leave(`/topic/games/${id}/gamedeleted`);
    history.push(`/games/` + id);
  };

  // when a message comes in through this channel, the game is shut down, remove gameId from sessinStorage and reroute to home
  const gameHasEnded = (message) => {
    const id = params.id;
    // leave all lobby topics
    webSocket.leave(`/topic/games/${id}/lobby`);
    webSocket.leave(`/topic/games/${id}/gamestart`);
    webSocket.leave(`/topic/games/${id}/gamedeleted`);

    /* remove gameid from sessionStorage */
    sessionStorage.removeItem("gameId");

    history.push("/");
  };

  /* starts the game with all the players that are currently in the lobby*/
  const startGame = () => {
    const id = params.id;
    // console.log(id);
    webSocket.send("/app/games/" + id + "/startGame", {
      message: "START GAME " + id,
    });
    history.push(`/games/${id}`);

    // take this out once everything above works
    // console.log("Game with ID " + id + " has been started");
  };

  async function exitLobby() {
    const id = params.id;

    try {
      // fetch the user trying to leave the game
      const token = JSON.parse(sessionStorage.getItem("token")).token;
      console.log("leave game: token " + token);
      // If the user is not authorized, this REST request will fail
      const response = await api.delete(`/games/` + id, {
        headers: { Authorization: token },
      });

      // if the player leaving was the host and the game was in lobby, the backend will send a message to /games/id/gamedeleted

      /* unsubscribe from all lobby channels */
      webSocket.leave(`/topic/games/${id}/lobby`);
      webSocket.leave(`/topic/games/${id}/gamestart`);
      webSocket.leave(`/topic/games/${id}/gamedeleted`);

      /* remove gameid from sessionStorage */
      sessionStorage.removeItem("gameId");

      // Edit successfully worked --> navigate to the route /profile/id
      console.log("Left game");
    } catch (error) {
      alert(`Something went wrong while leaving game: \n${handleError(error)}`);
    }

    history.push(`/`);
  }

  return (
    <BaseContainer className="lobby container">
      {hasFetchedGame ? (
        <ul>
          <div display="flex" flex-direction="row">
            <h2>{game.gameName}</h2>
            <div>{players.length}/6</div>
          </div>
          <div>
            {players.map((player) => (
              <Players player={player} key={player.id} />
            ))}
          </div>
          <div style={{display: "flex", gap: "1em"}}>
            <Button
                className="primary-button"
                onClick={() => exitLobby()}>Leave Lobby</Button>
            <Button
              className="primary-button"
              disabled={!players || players.length < 2 || !isHost}
              onClick={() => startGame()}
            >
              Start Game
            </Button>
          </div>
        </ul>
      ) : (
        <div />
      )}
    </BaseContainer>
  );
};

export default PvPLobby;
