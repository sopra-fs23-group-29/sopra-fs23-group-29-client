import React, { useEffect, useState } from "react";
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
  // must take id of the lobby as props but how?
  const joinLobby = () => {
    console.log("You joined a lobby.");
  };

  return (
    <div className="home lobby-container">
      <div>Name of an existing Lobby free to join</div>
      <button
        className="home lobby-container button"
        onClick={() => joinLobby()}
      >
        Join Lobby
      </button>
    </div>
  );
};

const Home = (props) => {
  const history = useHistory();

  useEffect(() => {
    /* join the topic/games to get all open lobbies as soon as the home page is opened
    update de display of all lobbies whenever they chang*/
    let webSocket = Stomper.getInstance();
    webSocket.join("/topic/games", function (payload) {
      console.log(JSON.parse(payload.body).content);
    });
  }, []);

  /*
  // Starts a solo Game by creating a game server side and opening a view where game settings can be changed.
  const startSoloGame = () => {
    history.push("/");
  };
  */

  /* Opens the Lobbysettings page (PvP Game) where a name for the game can be entered.*/
  const createGameLobby = () => {
    history.push(`/lobby`);
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
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Home;
