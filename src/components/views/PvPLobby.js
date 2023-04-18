import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Stomper from "../../helpers/Stomp";

/* This is the view for an open PvP Game Lobby that displays its name and all players in the lobby  */

const Players = (props) => {
  // needs to be adaptive to display current players
  return <div>Player 1</div>;
};

const PvPLobby = (props) => {
  const history = useHistory();
  const params = useParams();
  let webSocket = Stomper.getInstance();

  useEffect(() => {
    async function fetchData() {
      /* get gameId */
      const gameId = params.id;

      /* subscribe to topic/games/{gameId} */
      webSocket.join("/topic/games/" + gameId, function (payload) {
        console.log(JSON.parse(payload.body).content);
      });

      /* Get the current game */
      webSocket.send("/app/games/" + gameId + "/getGame", { message: "GET GAME " + gameId });
    }
    fetchData();
  }, []);

  /* starts the game with all the players that are currently in the lobby*/
  const startGame = () => {
    const id = params.id;
    console.log(id);
    webSocket.send("/app/games/" + id + "/startGame", {
      message: "START GAME " + id,
    });

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
      This is your Lobby with the name you gave it and you as a player
      <Players />
      <Button onClick={() => startGame()}>Start Game</Button>
      <Button onClick={() => exitLobby()}>Exit</Button>
    </BaseContainer>
  );
};

export default PvPLobby;
