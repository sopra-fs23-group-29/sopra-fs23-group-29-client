import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import Stomper from "../../helpers/Stomp";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Registration = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);

  const goToLogin = () => {
    history.push("/login");
  };

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ password, username });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store a token into the local storage for verification if logged in
      // currently in use: token
      const token = response.headers["authorization"];
      sessionStorage.setItem(
        "token",
        JSON.stringify({ token: token, id: user.id, username: user.username })
      );

      let webSocket = Stomper.getInstance();
      webSocket.connect().then(() => {
        history.push(`/`);
      });

    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    setUsernameChecked(checkString(username));
  }, [username])

  useEffect(() => {
    setPasswordChecked(checkString(password));
  }, [password])
  
  const checkString = (stringToCheck) => {

    if (!stringToCheck) {
      return false;
    }

    // check if only digits and letters

    // if only 1 character, must be A-Za-z0-9
    if (stringToCheck.length === 1) {
      return /[A-Za-z0-9]/.test(stringToCheck)
    }

    // _ is allowed in the middle
    return /^[A-Za-z0-9]{1}[_A-Za-z0-9]*[A-Za-z0-9]{1}$/.test(stringToCheck);

  }

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password || !usernameChecked || !passwordChecked}
              width="100%"
              onClick={() => doRegistration()}
            >
              Registration
            </Button>
            <Button width="100%" onClick={() => goToLogin()}>
              To login
            </Button>
          </div>
          <div className="login label">
            Only use letters and digits and underscores. No leading or trailing underscores.
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;
