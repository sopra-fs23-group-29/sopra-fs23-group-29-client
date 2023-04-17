import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
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
// right now with dummy data, change to real once websockets work
const DisplayLobby = (props) => {
  const history = useHistory();
  // must take id of the lobby as props but how?
  const joinLobby = () => {
    const gameId = 1;
    history.push(`/lobby/${gameId}`);
  };

  return (
    <div className="home lobby-container">
      <div>Name of an existing Lobby free to join</div>
      <button
        className="home lobby-container button"
        onClick={() => joinLobby()}
      >
        Join Lobby
      </button>
    </div>
  );
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

  const [gameToAnswer, setGameToAnswer] = useState(null);
  const [turnToAnswer, setTurnToAnswer] = useState(null);
  const [playerToAnswer, setPlayerToAnswer] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [guess, setGuess] = useState(null);

  const [gameIdToJoin, setgameIdToJoin] = useState(null);

  const [gameIdToLeave, setGameIdToLeave] = useState(null);

  const [gameToStart, setGameToStart] = useState(null);

  const [gameBarrierAnswer, setGameBarrierAnswer] = useState(null);
  const [playerBarrierAnswer, setplayerBarrierAnswer] = useState(null);
  const [barrierAnswer, setBarrierAnswer] = useState(null);
  
  const [gameEndTurn, setGameEndTurn] = useState(null);
  const [turnEndTurn, setTurnEndTurn] = useState(null);

  const [gameToMove, setGameToMove] = useState(null);
  const [playerToMove, setPlayerToMove] = useState(null);

  let webSocket = Stomper.getInstance();

  useEffect(() => {
    async function fetchData() {

      webSocket.join("/topic/games", countNumberOfLobbies);

      webSocket.send("/app/games/getAllGames", { message: "GET ALL GAMES" });

    }
    fetchData();
  }, []);

  // Test function to count the number of games received through /topic/games
  const countNumberOfLobbies = (message) => {
    if (message.body) {
      var games = JSON.parse(message.body);
      console.log("Number of games received: " + games.length);
    }
  }

  /* Starts a solo Game by creating a game server side and opening a view where game settings can be changed.*/
  const startSoloGame = () => {
    history.push("/sologame");
  };

  /* Opens the Lobbysettings page (PvP Game) where a name for the game can be entered.*/
  const createGameLobby = () => {
    history.push(`/lobby`);
  };

  /* Fake call to join a game
   */
  const joinGame = async () => {
    try {

      /* subscribe to topic/games/{gameId} */
      webSocket.join("/topic/games/" + gameIdToJoin, function (payload) {
        console.log(JSON.parse(payload.body).content);
      });

      const token = JSON.parse(localStorage.getItem("token")).token;
      const response = await api.post(
        `/games/` + gameIdToJoin,
        {},
        { headers: { Authorization: token } }
      );

      // Edit successfully worked --> navigate to the route /profile/id
      console.log("Joined game");
    } catch (error) {
      alert(
        `Something went wrong while creating game: \n${handleError(error)}`
      );
    }
  };

  /* Fake call to leave a game
   */
  const leaveGame = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token")).token;
      console.log("leave game: token " + token);
      const response = await api.delete(`/games/` + gameIdToLeave, {
        headers: { Authorization: token },
      });

      // Edit successfully worked --> navigate to the route /profile/id
      console.log("Left game");
    } catch (error) {
      alert(`Something went wrong while leaving game: \n${handleError(error)}`);
    }
  };

  /* Fake call to start game with ID 1
   */
  const startGame = () => {
    webSocket.send("/app/games/" + gameToStart +"/startGame", { message: "START GAME " + gameToStart});
  };

  /* Fake call to save an answer
   */
  const saveAnswer = () => {
    webSocket.send(`/app/games/${gameToAnswer}/turn/${turnToAnswer}/player/${playerToAnswer}/saveAnswer`, {
      userToken: JSON.parse(localStorage.getItem("token")).token,
      countryCode: countryCode,
      guess: guess,
    });
  };

  /* Fake call to save a barrier answer
   */
  const saveBarrierAnswer = () => {
    webSocket.send(`/app/games/${gameBarrierAnswer}/player/${playerBarrierAnswer}/resolveBarrierAnswer`, {
      userToken: JSON.parse(localStorage.getItem("token")).token,
      guess: barrierAnswer,
    });
  };

  /* Fake call to end the current turn in game with ID 1
   */
  const endTurn = () => {
    webSocket.send(`/app/games/${gameEndTurn}/turn/${turnEndTurn}/endTurn`, {
      message: `End turn game ${gameEndTurn}, turn ${turnEndTurn}`,
    });
  };

  /* Fake call to move player with ID 1 in game 1
   */
  const movePlayer = () => {
    webSocket.send(`/app/games/${gameToMove}/player/${playerToMove}/moveByOne`, {
      message: "MOVE PLAYER" + playerToMove + "BY ONE",
    });
  };

  /* Fake call to start next turn in game with ID 1
   */
  const nextTurn = () => {
    webSocket.send("/app/games/1/nextTurn", { message: "START NEXT TURN" });
  };

  return (
    <BaseContainer className="home container">
      <h2>PvP Lobbies</h2>
      <DisplayLobby />
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
        onClick={() => startSoloGame()}
      >
        Single Player Game
      </Button>



      <Button className="primary-button" width="15%" onClick={() => joinGame()}>
        Join game
      </Button>
      <div className="login form">
        <FormField
          label="gameToJoin"
          value={gameIdToJoin}
          onChange={(un) => setgameIdToJoin(un)}
        />
      </div>



      <Button
        className="primary-button"
        width="15%"
        onClick={() => leaveGame()}
      >
        Leave game
      </Button>
      <div className="login form">
        <FormField
          label="gameToLeave"
          value={gameIdToLeave}
          onChange={(un) => setGameIdToLeave(un)}
        />
      </div>
      

      <Button
        className="primary-button"
        width="15%"
        onClick={() => startGame()}
      >
        Start game
      </Button>
      <div className="login form">
        <FormField
          label="gameToStart"
          value={gameIdToLeave}
          onChange={(un) => setGameToStart(un)}
        />
      </div>



      <Button
        className="primary-button"
        width="15%"
        onClick={() => saveAnswer()}
      >
        Save Answer
      </Button>
      <div className="login form">
        <FormField label="game" value={gameToAnswer} onChange={(un) => setGameToAnswer(un)} />
        <FormField label="turn" value={turnToAnswer} onChange={(n) => setTurnToAnswer(n)} />
        <FormField label="player" value={playerToAnswer} onChange={(n) => setPlayerToAnswer(n)} />
        <FormField label="countryCode" value={countryCode} onChange={(n) => setCountryCode(n)} />
        <FormField label="guess" value={guess} onChange={(n) => setGuess(n)} />
      </div>




      <Button
        className="primary-button"
        width="15%"
        onClick={() => saveBarrierAnswer()}
      >
        Save Barrier Answer
      </Button>
      <div className="login form">
        <FormField label="gameBarrierAnswer" value={gameBarrierAnswer} onChange={(un) => setGameBarrierAnswer(un)} />
        <FormField label="playerBarrierAnswer" value={playerBarrierAnswer} onChange={(un) => setplayerBarrierAnswer(un)} />
        <FormField label="barrierAnswer" value={barrierAnswer} onChange={(un) => setBarrierAnswer(un)} />
      </div>




      <Button className="primary-button" width="15%" onClick={() => endTurn()}>
        End Turn
      </Button>
      <div className="login form">
        <FormField label="gameEndTurn" value={gameEndTurn} onChange={(un) => setGameEndTurn(un)} />
        <FormField label="turnEndTurn" value={turnEndTurn} onChange={(un) => setTurnEndTurn(un)} />
      </div>




      <Button
        className="primary-button"
        width="15%"
        onClick={() => movePlayer()}
      >
        Move Player
      </Button>
      <div className="login form">
        <FormField label="moveGame" value={gameToMove} onChange={(un) => setGameToMove(un)} />
        <FormField label="movePlayer" value={playerToMove} onChange={(un) => setPlayerToMove(un)} />
      </div>

      <Button className="primary-button" width="15%" onClick={() => nextTurn()}>
        Start Next Turn
      </Button>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Home;
