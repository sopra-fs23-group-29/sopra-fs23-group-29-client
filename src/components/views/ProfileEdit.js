import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/ProfileEdit.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = props => {
    return (
        <div className="edit field">
            <label className="edit label">
                {props.label}
            </label>
            <input
                className="edit input"
                placeholder="enter here.."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const ProfileEdit = props => {

    const id = useParams().id;
    const token = JSON.parse(sessionStorage.getItem('token')).token

    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [birthday, setBirthday] = useState(null);
    const [cioc, setCIOC] = useState(null);

    const doEdit = async () => {
        try {

            // Check if a user comes back, meaning the user exists and pw is correct
            const requestBody = JSON.stringify({username, birthday, cioc});
            // console.log(requestBody)
            const response = await api.put(
                `/users/${id}`,
                requestBody,
                {headers:{"Authorization": token}}
            );

            if (username) {
                // Edit successfully worked --> update sessionStorage token
                sessionStorage.setItem('token', JSON.stringify({
                        "token": JSON.parse(sessionStorage.getItem('token')).token, // token does not change
                        "id": JSON.parse(sessionStorage.getItem('token')).id, // id does not change
                        "username": username
                    }
                ));
            }

            // Edit successfully worked --> navigate to the route /profile/id
            history.push(`/profile/${id}`);

        } catch (error) {
            alert(`Something went wrong while editing your profile: \n${handleError(error)}`);
        }
    };

    const deleteUser = async () => {
        let password = window.prompt("Enter password to delete profile: ", "")
        try {
            const response = await api.delete(
                `/users/${id}`,
                {headers:
                        {
                            "Authorization": token,
                            "Password": password,
                            "Username": JSON.parse(sessionStorage.getItem('token')).username
                        }
                }
            );

            // removing the token from local storage and rerouting the user to the login page
            sessionStorage.removeItem('token');
            history.push("/login");
        } catch (error) {
            alert(`Something went wrong while deleting your profile: \n${handleError(error)}`);
        }
    }

    const getNewRandomFlag = async () => {
        try {
            const response = await api.delete(
                `/users/${id}/flag`,
                {headers:{"Authorization": token}}
            )

            // Edit successfully worked --> navigate to the route /profile/id
            history.push(`/profile/${id}`);
        }
        catch (error) {
            alert(`Something went wrong while replacing your flag: \n${handleError(error)}`);
        }
    }

    return (
        <BaseContainer>
            <div className="edit container">
                <div className="edit form">
                    <h2 style={{marginBottom: "0"}}>Edit profile</h2>
                    <h3 style={{fontWeight: "normal"}}>Empty means unchanged</h3>
                    <p style={{fontSize: "1.1em"}}>Flag</p>
                    <div className="edit button-container">
                        <Button
                            style={{marginTop: "0em", marginBottom: "1em"}}
                            width="50%"
                            onClick={() => setCIOC("SUI")}
                        >
                            get neutral Flag
                        </Button>
                        <Button
                            style={{marginTop: "0em", marginBottom: "1em"}}
                            width="50%"
                            onClick={() => getNewRandomFlag()}
                        >
                            get random flag
                        </Button>
                    </div>
                    <FormField
                        label="IOC Country code"
                        value={cioc}
                        onChange={c => setCIOC(c)}
                    />
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    {/*
                    <label style={{fontSize: "1.1em"}}>Birthday</label>
                    <input
                        type="date"
                        max="today"
                        className="edit input"
                        id="birthday"
                        style={{marginBottom: "1em"}}
                        onChange={b => setBirthday(b)}
                    >

                    </input>
                    */}
                    <FormField
                        label="Birthday"
                        value={birthday}
                        onChange={b => setBirthday(b)}
                    />
                    <div className="edit button-container">
                        <Button
                            width="100%"
                            onClick={() => deleteUser()}
                            style={{backgroundColor: "indianred"}}
                        >
                            Delete Profile
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => doEdit()}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ProfileEdit;
