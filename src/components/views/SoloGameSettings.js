import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import Stomper from "../../helpers/Stomp";

const SoloGameSettings = (props) => {
  const history = useHistory();
  const [gameMode, setGameMode] = useState(null);
  const [hasGameMode, setHasGameMode] = useState(false);
  const [isHowFar, setIsHowFar] = useState(false);
  const [isHowFast, setIsHowFast] = useState(false);

  /* executed whenever the How Far option is chosen */
  const howFarChosen = () => {
    setIsHowFar(!isHowFar);
    setIsHowFast(false);
  };

  /* executed whenever the How Fast option is chosen */
  const howFastChosen = () => {
    setIsHowFast(!isHowFast);
    setIsHowFar(false);
  };

  /* useEffect needs to be used here to immediately update ishowfast and ishowfar when a checkbox is clicked*/
  useEffect(() => {
    console.log("far: " + isHowFar);
    console.log("fast: " + isHowFast);
    /* Change hasGameMode (for startGame() button display) iff either ishowfar or ishowfast is true*/
    (isHowFar & !isHowFast) | (!isHowFar & isHowFast)
      ? setHasGameMode(true)
      : setHasGameMode(false);
    console.log("has game mode: " + hasGameMode);
  }, [isHowFar, isHowFast, hasGameMode]);

  useEffect(() => {
    async function createGame() {
      if (gameMode != null) {
        /* create game name */
        const newName = JSON.parse(sessionStorage.getItem("token")).username;
        console.log(newName);
        const nameForGame = "Solo Game for " + newName;
        console.log(nameForGame);

        /* rest call to start solo game */
        try {
          const requestBody = JSON.stringify({
            gameName: nameForGame,
            gameMode: gameMode,
          });
          const token = JSON.parse(sessionStorage.getItem("token")).token;
          console.log(requestBody);

          /* Call to server sending gameName and gameMode PVP to create the lobby */
          const response = await api.post(`/games`, requestBody, {
            headers: {
              Authorization: token,
            },
          });

          /* Take out later */
          console.log("Created game");
          console.log("Game ID : " + JSON.stringify(response.data.gameId));

          /* Map answer from server to get the game id */
          const gameId = response.data.gameId;

          /* push to lobby screen using the id we got as response from the server once the game is created there*/
          history.push(`/sologame/${gameId}`);
        } catch (error) {
          alert(
            `Something went wrong while creating game: \n${handleError(error)}`
          );
        }
      } else return;
    }
    createGame();
  }, [gameMode]);

  const startGame = async () => {
    if (hasGameMode) {
      if (isHowFar) {
        setGameMode("HOWFAR");
      } else if (isHowFast) {
        setGameMode("HOWFAST");
      }
    } else return;
  };

  const backToLobbyOverview = () => {
    history.push(`/`);
  };

  return (
    <BaseContainer className="home container">
      <h2>Choose your prefered game mode:</h2>
      <label>
        <input
          type="checkbox"
          checked={isHowFar}
          onChange={() => howFarChosen()}
        ></input>
        See how far you can get
      </label>
      <label>
        <input
          type="checkbox"
          checked={isHowFast}
          onChange={() => howFastChosen()}
        ></input>
        See how fast you can go
      </label>
      {isHowFar ? <div>Select how long you want to play for:</div> : <div />}
      {isHowFast ? (
        <div>Select the number of tiles on the game board:</div>
      ) : (
        <div />
      )}
      <Button onClick={() => startGame()} disabled={!hasGameMode}>
        Start Game
      </Button>
      <Button onClick={() => backToLobbyOverview()}>Cancel</Button>
    </BaseContainer>
  );
};

export default SoloGameSettings;
