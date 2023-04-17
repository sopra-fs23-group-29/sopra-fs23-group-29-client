import React, { useState } from "react";
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

const Login = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const goToRegistration = () => {
    history.push("/registration");
  };

  const connectWebSocket = async () => {
    let webSocket = Stomper.getInstance().then(() => {
      webSocket.join("/topic/games", function (payload) {
        console.log(JSON.parse(payload.body).content);
      });
    });
  }

  const doLogin = async () => {
    try {
      // Check if a user comes back, meaning the user exists and pw is correct
      const requestBody = JSON.stringify({ password, username });
      const response = await api.put("/users/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store a token into the local storage for verification if logged in
      // currently in use: token
      const token = response.headers["authorization"];
      localStorage.setItem(
        "token",
        JSON.stringify({ token: token, id: user.id, username: user.username })
      );

      connectWebSocket().then(() => {});

      // let webSocket = Stomper.getInstance().then(() => {
      //   webSocket.join("/topic/games", function (payload) {
      //     console.log(JSON.parse(payload.body).content);
      //   });
      // });

      // let webSocket = Stomper.getInstance().then(() => {});
      // webSocket.join("/topic/games", function (payload) {
      //   console.log(JSON.parse(payload.body).content);
      // });
    
      history.push(`/`);

      // Login successfully worked --> navigate to the route /game in the GameRouter
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

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
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <Button width="100%" onClick={() => goToRegistration()}>
              To registration
            </Button>
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
export default Login;
