import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import Stomper from "../../helpers/Stomp";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

/* Displays the lobbies that people can join*/
const DisplayLobby = ({ lobby }) => {
  const history = useHistory();
  let players = lobby.players;

  /* Joins the lobby and navigates to the lobby page */
  const joinLobby = async (id) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token")).token;

      // if we have a gameId in the sessionStorage and its the same as the game we want to join
      // just reroute to that lobby
      if (sessionStorage.getItem("gameId")) {
        if (id.toString() === sessionStorage.getItem("gameId")) {
          console.log("user was already in lobby, rejoin by rerouting");
          history.push(`/lobby/${id}`);
          return;
        }
      }

      await api.post(`/games/${id}`, {}, { headers: { Authorization: token } });

      /* unsubscribe from topic/games */
      let webSocket = Stomper.getInstance();
      webSocket.leave("/topic/games");

      /* set the gameid into the sessionStorage */
      sessionStorage.setItem("gameId", id);

      /* navigate to lobby page */
      history.push(`/lobby/${id}`);
    } catch (error) {
      alert(
        `Something went wrong while creating game: \n${handleError(error)}`
      );
    }
  };

  if (lobby.joinable) {
    return (
      <div className="home lobby-container">
        <div>{lobby.gameName}</div>
        <div>{players.length}/6</div>
        <button
          className="home lobby-container button"
          onClick={() => joinLobby(lobby.gameId)}
        >
          Join Lobby
        </button>
      </div>
    );
  } else {
    return <div></div>;
  }
};

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

const Home = (props) => {
  const history = useHistory();
  let webSocket = Stomper.getInstance();

  const [lobbies, setLobbies] = useState([]);
  const [hasLobbies, setHasLobbies] = useState(false);

  useEffect(() => {
    async function fetchData() {
      webSocket.join("/topic/games", displayOpenLobbies);
      webSocket.send("/app/games/getAllGames", { message: "GET ALL GAMES" });
    }
    fetchData();
  }, []);

  useEffect(() => {
    // console.log(lobbies);
    // console.log(hasLobbies);
  }, [lobbies, hasLobbies]);

  /* assign content to lobbies to display them */
  const displayOpenLobbies = (message) => {
    let games = JSON.parse(message.body);
    if (games.length > 0) {
      setLobbies(games);
      setHasLobbies(true);
      console.log("Number of games received: " + games.length);
      console.log(games);
    }
  };

  /* Redirect to Solo Game Settings page*/
  const openSoloGame = () => {
    webSocket.leave("/topic/games");
    history.push("/sologame");
  };

  /* Opens the Lobbysettings page (PvP Game) where a name for the game can be entered.*/
  const createGameLobby = () => {
    webSocket.leave("/topic/games");
    history.push(`/lobby`);
  };

  const goToRules = () => {
    webSocket.leave("/topic/games");
    history.push(`/howto`);
  };

  const leaveAllGames = async () => {
    try {

      const promise = await api.delete(
        "/games/",
        {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
      )
      const response = await promise.data;
      if (promise.status == 200) {
        const gameIdLeft = response.gameId;
        window.alert(`You were in game ${gameIdLeft}, you were removed from that game`);

        // make sure there is no gameId lingering in the sessionStorage
        sessionStorage.removeItem("gameId");
      }
      
    } catch (error) {      
      // A 409 means there were no games to leave, thats ok, inform the user
      if (error.response.status == 409) {
        window.alert("You were in no games, nothing happened");
      } else {
        console.log(`Something went wrong when leaving all games: \n${handleError(error)}`);
      }
    }
  }

  return (
    <BaseContainer className="home container">
      <h2>PvP Lobbies</h2>{" "}
      {hasLobbies ? (
        <div>
          {lobbies.map((lobby) => (
            <DisplayLobby lobby={lobby} key={lobby.gameId} />
          ))}
        </div>
      ) : (
        <div className="home lobby-container">
          There are no multiplayer games to join. You can create your own by
          clicking on the button below!
        </div>
      )}
      <div className="home button-container">
        <Button
          className="primary-button"
          width="20%"
          onClick={() => createGameLobby()}
        >
          Create Multiplayer Lobby
        </Button>
        <Button
          className="primary-button"
          width="15%"
          onClick={() => openSoloGame()}
        >
          Single Player Game
        </Button>
      </div>
      <div className="home textbox">
        <div>New here? Check out our</div>
        <div className="home bold" onClick={() => goToRules()}>
          "How to Play"
        </div>
        <div>
          page to get instructions on how to play our solo and multiplayer
          games.
        </div>
      </div>

      <div className="home textbox">
        <div>Are you trying to open a new game but are stuck in a game you cannot leave? This can happen when you exit a game not using the intended header button. No problem, try this:</div>
      </div>
      <div className="home button-container">
        <Button
          className="primary-button"
          width="15%"
          onClick={() => leaveAllGames()}
        >
          Leave all games
        </Button>
      </div>
      
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Home;
