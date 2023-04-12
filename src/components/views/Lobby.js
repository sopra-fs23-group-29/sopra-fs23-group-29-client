import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/* This is the view for a PvP Game Lobby */

const NameFormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={"Please enter a name for this round of Globalissimo"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
NameFormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Lobby = (props) => {
  const history = useHistory();
  const [gameName, setGameName] = useState(null);
  const [hasName, setHasName] = useState(false);

  const createLobby = () => {
    // const name = gameName;
    // console.log(name);
    setHasName(true);
  };

  const startGame = () => {
    console.log("Game has been started");
  };

  const backToLobbyOverview = () => {
    history.push(`/`);
  };

  return (
    <BaseContainer className="home container">
      {hasName ? (
        <div>true</div>
      ) : (
        <ul>
          <NameFormField value={gameName} onChange={(un) => setGameName(un)} />
          <Button disabled={!gameName} onClick={() => createLobby()}>
            Create PvP Lobby
          </Button>
        </ul>
      )}
      {hasName ? (
        <ul>
          <Button onClick={() => backToLobbyOverview()}>Exit Lobby</Button>
          <Button onClick={() => startGame()}>Start Game</Button>
        </ul>
      ) : (
        <Button onClick={() => backToLobbyOverview()}>Cancel</Button>
      )}
    </BaseContainer>
  );
};

export default Lobby;
