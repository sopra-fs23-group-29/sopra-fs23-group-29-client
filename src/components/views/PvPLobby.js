import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import Stomper from "../../helpers/Stomp";

/* This is the view for an open PvP Game Lobby that displays its name and all players in the lobby  */

const Players = ({ player }) => {
  return (
    <div className="home lobby-container" width="30%">
      <div>{player.playerName}</div>
    </div>
  );
};

const PvPLobby = (props) => {
  const history = useHistory();
  const params = useParams();
  let webSocket = Stomper.getInstance();
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(null);
  const [hasFetchedGame, setHasFetchedGame] = useState(false);

  useEffect(() => {
    async function fetchData() {
      /* get gameId */
      const gameId = params.id;

      /* subscribe to topic/games/{gameId} */
      webSocket.join("/topic/games/" + gameId, getGameInfo);

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

  /* get info from websocket message to display players in lobby */
  const getGameInfo = (message) => {
    setGame(JSON.parse(message.body));
    setHasFetchedGame(true);
  };

  /* starts the game with all the players that are currently in the lobby*/
  const startGame = () => {
    const id = params.id;
    sessionStorage.setItem("gameId", id)
    console.log(id);
    webSocket.send("/app/games/" + id + "/startGame", {
      message: "START GAME " + id,
    });
    history.push(`/games/` + id);

    // take this out once everything above works
    console.log("Game with ID " + id + " has been started");
  };

  const exitLobby = () => {
    /* check if person who wants to exit is the creator of the lobby*/

    /* if person exiting is creator of lobby: delete lobby (and game on server) and 
        redirect all players to the home screen*/

    /* if person exiting is just a player: delete them as player and redirect to home screen,
        update player list for all remaining players */

    //delete once everything above works
    history.push(`/`);
  };

  return (
    <BaseContainer className="home container">
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
          <Button onClick={() => exitLobby()}>Leave Lobby</Button>
          <Button onClick={() => startGame()}>Start Game</Button>
        </ul>
      ) : (
        <div />
      )}
    </BaseContainer>
  );
};

export default PvPLobby;
