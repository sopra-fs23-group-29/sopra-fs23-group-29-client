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
    const [password, setPassword] = useState(null);
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
                <div className="edit head-line">Please enter new Username and Birthday. Empty means unchanged</div>
                <div className="edit form">
                    <FormField
                        label="New Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="New Birthday"
                        value={birthday}
                        onChange={b => setBirthday(b)}
                    />
                    <FormField
                        label="New Country for Flag"
                        value={cioc}
                        onChange={c => setCIOC(c)}
                    />
                    <div className="edit button-container">
                        <Button
                            width="100%"
                            onClick={() => doEdit()}
                        >
                            Edit Profile
                        </Button>
                    </div>
                    <div className="edit button-container">
                        <Button
                            width="100%"
                            onClick={() => getNewRandomFlag()}
                        >
                            get new random flag
                        </Button>
                    </div>
                    <FormField
                        label="Enter password to delete profile:"
                        value={password}
                        onChange={un => setPassword(un)}
                        margin-top="10em"
                    />
                    <div className="edit delete-button-container">
                        <Button
                            width="100%"
                            disabled={!password}
                            onClick={() => deleteUser()}
                        >
                            Delete Profile
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default ProfileEdit;
