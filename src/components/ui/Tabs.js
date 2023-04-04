import {Tab} from "./Tab";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import Stomper from "../../helpers/Stomp";

export default function Tabs() {
    const history = useHistory();
    const id = JSON.parse(localStorage.getItem('token')).id;
    let webSocket = Stomper.getInstance();
    const goToHome = () => {
        history.push("/");
    }

    const goToProfile = () => {
        history.push(`/profile/${id}`);
    }

    const goToUsers = () => {
        history.push("/users");
    }

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
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }

        // remove the token
        localStorage.removeItem('token');

        // remove websocket connection
        webSocket.leaveAll()
        webSocket.disconnect("User logged out");

        history.push('/login');

    };

  return (
      //TODO tabs should show on which side user is
        <Tab className="tab container">
            <Tab
                className="tab primary-tab"
                onClick={() => goToHome()}
            >
              Home
            </Tab>
            <Tab
                className="tab primary-tab"
                onClick={() => goToProfile()}
            >
              Profile
            </Tab>
            <Tab
                className="tab primary-tab"
                onClick={() => goToUsers()}
            >
              User
            </Tab>
            <Tab
                className="tab primary-tab"
                onClick={() => doLogout()}
            >
                Logout
            </Tab>
        </Tab>
  );
}