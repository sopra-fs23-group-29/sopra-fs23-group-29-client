import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import Stomper from "../../helpers/Stomp";

const Checkbox = ({ label, value, onChange }) => {
  return <label></label>;
};

const SoloGameSettings = (props) => {
  const history = useHistory();
  const [gameMode, setGameMode] = useState(null);
  const [hasGameMode, setHasGameMode] = useState(false);
  const [isHowFar, setIsHowFar] = useState(false);
  const [isHowFast, setIsHowFast] = useState(false);

  const howFarChosen = () => {
    setIsHowFar(!isHowFar);
    setIsHowFast(false);
  };

  const howFastChosen = () => {
    setIsHowFast(!isHowFast);
    setIsHowFar(false);
  };

  useEffect(() => {
    console.log("far: " + isHowFar);
    console.log("fast: " + isHowFast);
  }, [isHowFar, isHowFast]);

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

      <Button onClick={() => startGame()} disabled={!hasGameMode}>
        Start Game
      </Button>
      <Button onClick={() => backToLobbyOverview()}>Cancel</Button>
    </BaseContainer>
  );
};

export default SoloGameSettings;
