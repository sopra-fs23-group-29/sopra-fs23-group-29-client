import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

import { getWS } from "../../helpers/getDomain";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import Stomper from "helpers/Stomp";

const Users = props => {

  const Player = ({user}) => (
    <div className="player container" onClick={() => goToProfile(user.id)}>
      <div className="player username">{user.username}</div>
      <div className="player status">{user.status}</div>
    </div>
  );

  Player.propTypes = {
    user: PropTypes.object
  };  

  const history = useHistory();
  const id = useParams().id;

  const [users, setUsers] = useState(null);

  const doLogout = async () => {

    // set status to offline
    try {
      
      // set status to offline
      await api.put(
        '/users/logout',
        {},
        {headers:{"Authorization": JSON.parse(localStorage.getItem('token')).token}}
      );

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }

    // remove the token
    localStorage.removeItem('token');
    
    history.push('/login');

  };

  const goToProfile = (id) => {
      try {
          // Redirecting to profile page successfully worked
          history.push(`/users/${id}`);
      } catch (error) {
          alert(`Something went wrong during redirecting to the profile page: \n${handleError(error)}`);
      }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(
          '/users',
          {headers:{"Authorization": JSON.parse(localStorage.getItem('token')).token}}
        );

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        
        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let userSocket = new Stomper("/users");

  let content = <Spinner/>;

  if (users) {

    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map(user => (
            <Player user={user} key={user.id}/>
          ))}
        </ul>
        
        <Button
          width="100%"
          onClick={() => doLogout()}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Users -> WIP</h2>
      <p className="game paragraph">
        Get all users from secure endpoint:
      </p>
      {content}
    </BaseContainer>
  );
}

export default Users;
