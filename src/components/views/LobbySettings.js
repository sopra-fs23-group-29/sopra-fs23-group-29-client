import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import LobbyModel from "models/LobbyModel";
import Stomper from "../../helpers/Stomp";

/* This is the view for creating a PvP Game Lobby by entering the name first */

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

const LobbySettings = (props) => {
  const history = useHistory();
  const [gameName, setGameName] = useState(null);
  let webSocket = Stomper.getInstance();

  const createLobby = async () => {
    /* Call to server sending gameName, gameMode PVP, and player info for the person creating the lobby */
    const requestBody = JSON.stringify({
      gameName: gameName,
      gameMode: "PVP",
      // add player info
    });

    const response = await api.post(`/games/`, requestBody, {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("token")).token,
      },
    });

    /* Map answer from server to get the game id */
    const gameId = response.data;

    /* push to lobby screen using the id we got as response from the server once the game is created there*/
    history.push(`/lobby/${gameId}`);
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

export default LobbySettings;
