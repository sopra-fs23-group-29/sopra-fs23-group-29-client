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

  // TODO + figure out how to send specific settings for duration or tiles on game board to the server
  const startGame = async () => {};

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
