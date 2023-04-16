import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import LobbyModel from "models/LobbyModel";

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

  const createLobby = async () => {
    try {
      const requestBody = JSON.stringify({
        gameName: gameName,
        gameMode: "PVP",
      });
      const token = JSON.parse(localStorage.getItem("token")).token;
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
      history.push(`/lobby/${gameId}`);
    } catch (error) {
      alert(
        `Something went wrong while creating game: \n${handleError(error)}`
      );
    }
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
