import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const PvPLobby = (props) => {
  return (
    <div>This is your Lobby with the name you gave it and you as a player</div>
  );
};

export default PvPLobby;
