import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Stomper from "../../helpers/Stomp";

const PvPLobby = (props) => {
  const history = useHistory();

  /* starts the game with all the players that are currently in the lobby*/
  const startGame = () => {
    let webSocket = Stomper.getInstance();
    webSocket.join("/topic/games", function (payload) {
      console.log(JSON.parse(payload.body).content);
    });
    webSocket.send("/app/games/1/startGame", { message: "START GAME 1" });

    // take this out once everything above works
    console.log("Game has been started");
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
    <BaseContainer>
      This is your Lobby with the name you gave it and you as a player
      <Button onClick={() => startGame()}>Start Game</Button>
      <Button onClick={() => exitLobby()}>Exit</Button>
    </BaseContainer>
  );
};

export default PvPLobby;
