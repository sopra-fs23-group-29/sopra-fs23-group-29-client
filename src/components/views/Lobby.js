import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/* This is the view for a PvP Game Lobby */

const Lobby = (props) => {
  return <BaseContainer>Lobby</BaseContainer>;
};

export default Lobby;
