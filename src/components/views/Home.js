import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import Stomper from "../../helpers/Stomp";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

/* Displays the lobbies that people can join*/
// right now with dummy data, change to real once websockets work
const DisplayLobby = (props) => {
  return (
    <div className="home lobby-container">
      <div>Existing Lobby free to join</div>
      <button className="home lobby-container button">Join Lobby</button>
    </div>
  );
};

const Home = (props) => {
  const history = useHistory();

  /*
  // Starts a solo Game by creating a game server side and opening a view where game settings can be changed.
  const startSoloGame = () => {
    history.push("/");
  };
  */

  /* Opens a PvP Game Lobby where all game settings can be changed.
  WebSocket Call that creates a new PvP in the server and returns the unique Game ID.
  WebSocket Connection is then open and Lobby is updated with joining players.
  */
  const createGameLobby = () => {
    history.push(`/lobby`);
  };

  /* Fake call to start game with ID 1
  */
  const startGame1 = () => {
    let webSocket = Stomper.getInstance();

    webSocket.connect().then(() => {
      webSocket.join("/topic/users", function(payload){
        console.log(JSON.parse(payload.body).content);
      });
      webSocket.send("/app/games/1/startGame", {message : "START GAME 1"});
    });

    
  };

  return (
    <BaseContainer className="home container">
      <h2>PvP Lobbies</h2>
      <DisplayLobby />
      <Button
        className="primary-button"
        width="15%"
        onClick={() => createGameLobby()}
      >
        Create Lobby
      </Button>
      
      <Button
        className="primary-button"
        width="15%"
        onClick={() => startGame1()}
      >
        Start Game 1
      </Button>

    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Home;
