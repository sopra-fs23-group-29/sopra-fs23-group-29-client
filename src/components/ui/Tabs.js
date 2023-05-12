import { Tab } from "./Tab";
import { useHistory } from "react-router-dom";
import { api, handleError } from "../../helpers/api";
import Stomper from "../../helpers/Stomp";

export default function Tabs() {
  const history = useHistory();
  const id = JSON.parse(sessionStorage.getItem("token")).id;
  const token = JSON.parse(sessionStorage.getItem("token")).token;
  let webSocket = Stomper.getInstance();
  const goToHome = () => {
    history.push("/");
  };

  const goToProfile = () => {
    history.push(`/profile/${id}`);
  };

  const goToUsers = () => {
    history.push("/users");
  };

  const goToInstructions = () => {
    history.push("/howto");
  };

  const doLogout = async () => {
    // if in a game, try to leave it
    try {
      const gameId = sessionStorage.getItem("gameId");
      console.log("leave game: token " + token);
      // If the user is not authorized, this REST request will fail
      const response = await api.delete(`/games/` + gameId, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.log(`Player was not in a game, skip leaving game step`);
    }

    // set status to offline
    try {
      // set status to offline
      await api.put(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: JSON.parse(sessionStorage.getItem("token")).token,
          },
        }
      );
    } catch (error) {
      console.log(
        `Something went wrong during the logout: \n${handleError(error)}`
      );
    }

    try {
      // remove game from sessionStorage
      sessionStorage.removeItem("gameId");
      sessionStorage.removeItem("game");

      // remove the token
      sessionStorage.removeItem("token");

      // remove websocket connection
      webSocket.leaveAll();
      webSocket.disconnect("User logged out");
    } catch (error) {
      console.log(
        `Something went wrong while clearing the local storage or disconnecting from the websocket: \n${handleError(
          error
        )}`
      );
    }
    history.push("/login");
  };

  return (
    //TODO tabs should show on which side user is
    <Tab className="tab container">
      <Tab className="tab primary-tab" onClick={() => goToHome()}>
        Home
      </Tab>
      <Tab className="tab primary-tab" onClick={() => goToInstructions()}>
        How to Play
      </Tab>
      <Tab className="tab primary-tab" onClick={() => goToProfile()}>
        Profile
      </Tab>
      <Tab className="tab primary-tab" onClick={() => goToUsers()}>
        User
      </Tab>
      <Tab className="tab primary-tab" onClick={() => doLogout()}>
        Logout
      </Tab>
    </Tab>
  );
}
