import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
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

  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);

  const doEdit = async () => {
    try {
      
      // Check if a user comes back, meaning the user exists and pw is correct
      const requestBody = JSON.stringify({username, birthday});
      const response = await api.put(
        `/users/${id}`,
        requestBody,
        {headers:{"Authorization": JSON.parse(localStorage.getItem('token')).token}}
      );
      
      // Edit successfully worked --> update localStorage token
      localStorage.setItem('token', JSON.stringify({
        "token":JSON.parse(localStorage.getItem('token')).token, // token does not change
        "id":JSON.parse(localStorage.getItem('token')).id, // id does not change
        "username":username}
      ));

      // Edit successfully worked --> navigate to the route /profile/id
      history.push(`/profile/${id}`);

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };
  
  return (
    <BaseContainer>
      <div className="login container">
        <div className="login label">Please enter new Username and Birthday. Empty means unchanged</div>
        <div className="login form">
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
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doEdit()}
            >
              Edit Profile
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
export default ProfileEdit;
