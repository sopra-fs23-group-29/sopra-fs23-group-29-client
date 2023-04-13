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
    /* Call to server sending gameName, gameMode PVP, and player info for the person creating the lobby */

    /* Map answer from server to get the game id, game name and current players */

    /* push to lobby screen using the id we got as response from the server once the game is created there*/
    // history.push(`/lobby/${game.id}`);
    history.push(`/lobby/1`);

    // const name = gameName;
    // console.log(name);
    setHasName(true);
  };

  const backToLobbyOverview = () => {
    history.push(`/`);
  };

  return (
    <BaseContainer className="home container">
      <NameFormField value={gameName} onChange={(un) => setGameName(un)} />
      <Button disabled={!gameName} onClick={() => createLobby()}>
        Create PvP Lobby
      </Button>

      <Button onClick={() => backToLobbyOverview()}>Cancel</Button>
    </BaseContainer>
  );
};

export default Lobby;
