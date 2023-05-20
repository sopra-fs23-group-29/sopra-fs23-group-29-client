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
            <i className="login icon">{props.icon}</i>
            <label className="login label">{props.label}</label>
            <input
                className="login input"
                placeholder={props.placeholder}
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
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const goToRegistration = () => {
        history.push("/registration");
    };

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
            sessionStorage.setItem(
                "token",
                JSON.stringify({ token: token, id: user.id, username: user.username })
            );

            let webSocket = Stomper.getInstance();
            webSocket.connect().then(() => {
                history.push(`/`);
            });

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer className="login container">
            <h2 style={{marginTop: "0"}}>Login</h2>
            <div className="login form">
                <FormField
                    icon="account_circle"
                    label="Username"
                    placeholder="Username"
                    value={username}
                    onChange={(un) => setUsername(un)}
                />
                <FormField
                    icon="lock"
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(n) => setPassword(n)}
                />
                <div className="login secondary-button-container">
                    <Button
                        className="secondary-button"
                        onClick={() => goToRegistration()}>
                        Create Account
                    </Button>
                </div>
                <div className="login button-container">
                    <Button
                        className="primary-button"
                        disabled={!username || !password}
                        width="50%"
                        onClick={() => doLogin()}
                    >
                        Login
                    </Button>
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
