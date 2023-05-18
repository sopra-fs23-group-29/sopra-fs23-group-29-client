import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Users.scss";
import Stomper from "../../helpers/Stomp";


const Users = () => {
    const Player = ({user}) => (
        <div className="player container" onClick={() => goToProfile(user.id)}>
            <div className="player username">{user.username}</div>
            <div className="player status">{user.status}</div>
        </div>
    );

    Player.propTypes = {
        user: PropTypes.object
    };

    // use react-router-dom's hook to access the history
    const history = useHistory();

    const [users, setUsers] = useState(null);

    const goToProfile = (id) => {
        history.push(`/profile/${id}`);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(
                    '/users',
                    {headers:{"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
                );

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 500));

                // Get the returned users and update the state.
                setUsers(response.data);
                
                // subscribe to /users - no .connect() needed
                let webSocket = Stomper.getInstance();
                webSocket.join("/topic/users", function (payload) {
                    console.log(JSON.parse(payload.body).content)});

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;

    if (users) {

        content = (
            <div className="users">
                <ul className="users user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <BaseContainer className="users container">
            <h2>User</h2>
            {content}
        </BaseContainer>
    );
}

export default Users;