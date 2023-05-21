import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import "styles/views/SoloGameSettings.scss";
import BaseContainer from "components/ui/BaseContainer";
import BoardSizeSelect from "components/ui/BoardSizeSelect";
import DurationSelect from "components/ui/DurationSelect";
import Stomper from "../../helpers/Stomp";

const SoloGameSettings = () => {
  const history = useHistory();
  const [gameMode, setGameMode] = useState(null);
  const [boardSize, setBoardSize] = useState(null);
  const [duration, setDuration] = useState(null);
  const [hasGameMode, setHasGameMode] = useState(false);
  const [isHowFar, setIsHowFar] = useState(false);
  const [isHowFast, setIsHowFast] = useState(false);

  let webSocket = Stomper.getInstance();

  /* executed whenever the How Far option is chosen */
  const howFarChosen = () => {
    setIsHowFar(!isHowFar);
    setIsHowFast(false);
    setBoardSize(null);
  };

  /* executed whenever the How Fast option is chosen */
  const howFastChosen = () => {
    setIsHowFast(!isHowFast);
    setIsHowFar(false);
    setDuration(null);
  };

  useEffect(() => {
  }, [boardSize, duration]);

  /* useEffect needs to be used here to immediately update ishowfast and ishowfar when a checkbox is clicked*/
  useEffect(() => {
    /* Change hasGameMode (for startGame() button display) iff either ishowfar or ishowfast is true*/
    (isHowFar & !isHowFast) | (!isHowFar & isHowFast)
      ? setHasGameMode(true)
      : setHasGameMode(false);
  }, [isHowFar, isHowFast, hasGameMode]);

  useEffect(() => {
    async function createGame() {
      if (gameMode != null) {
        /* create game name */
        const newName = JSON.parse(sessionStorage.getItem("token")).username;
        const nameForGame = "Solo Game for " + newName;
        console.log(nameForGame);

        /* rest call to start solo game */
        try {
          const requestBody = JSON.stringify({
            gameName: nameForGame,
            gameMode: gameMode,
            boardSize: boardSize,
            maxDuration: duration,
          });
          const token = JSON.parse(sessionStorage.getItem("token")).token;
          console.log(requestBody);

          /* Call to server sending gameName and gameMode PVP to create the lobby */
          const response = await api.post(`/games`, requestBody, {
            headers: {
              Authorization: token,
            },
          });

          /* Take out later */
          console.log("Created game");
          console.log("Game ID : " + JSON.stringify(response.data.gameId));

          /* Map answer from server to get the game id */
          const gameId = response.data.gameId;

          /* Set the current gameId in sessionStorage */
          sessionStorage.setItem("gameId", gameId);

          /* send a message to the server to start the game */
          webSocket.send("/app/games/" + gameId + "/startGame", {
            message: "START GAME " + gameId,
          });

          /* push to game screen using the id we got as response from the server once the game is created there*/ 
          history.push(`/games/${gameId}`);


        } catch (error) {
          alert(
            `Something went wrong while creating game: \n${handleError(error)}`
          );
        }
      } else return;
    }
    createGame();
  }, [gameMode]);

  const startGame = async () => {
    if (hasGameMode) {
      if (isHowFar) {
        setGameMode("HOWFAR");
        setBoardSize("LARGE");
      } else if (isHowFast) {
        setGameMode("HOWFAST");
        setDuration("NA");
      } else return;
    } else return;
  };

  const changeBoardSize = (size) => {
    setBoardSize(size);
  };

  const changeDuration = (dur) => {
    setDuration(dur);
  };

  const backToLobbyOverview = () => {
    history.push(`/`);
  };

  return (
    <BaseContainer className="home container">
      <h2>Choose your preferred game mode:</h2>
      <div className="solosettings">
        <div className="solosettings container">
          <label>
            <input
              type="checkbox"
              checked={isHowFar}
              onChange={() => howFarChosen()}
            ></input>
            See how far you can get
          </label>
          <label>
            <input
              type="checkbox"
              checked={isHowFast}
              onChange={() => howFastChosen()}
            ></input>
            See how fast you can go
          </label>
        </div>
        <div className="solosettings container">
          {isHowFar ? (
            <div>
              <div>Select how long you want to play for:</div>
              <DurationSelect changeDuration={changeDuration} />
            </div>
          ) : (
            <div />
          )}
          {isHowFast ? (
            <div>
              <div>Select the size of the game board:</div>
              <BoardSizeSelect changeBoardSize={changeBoardSize} />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
      <Button
        className="primary-button"
        onClick={() => startGame()}
        disabled={
          !hasGameMode ||
          (hasGameMode && isHowFast && boardSize == null) ||
          (hasGameMode && isHowFar && duration == null)
        }
      >
        Start Game
      </Button>
      <Button
          className="primary-button"
          onClick={() => backToLobbyOverview()}>
        Cancel
      </Button>
    </BaseContainer>
  );
};

export default SoloGameSettings;
