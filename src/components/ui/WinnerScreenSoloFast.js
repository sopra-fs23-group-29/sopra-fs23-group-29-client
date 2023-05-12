import BaseContainer from "./BaseContainer";
import "styles/views/WinnerScreen.scss";
import { Button } from "./Button";
import React from "react";
import { useParams, useHistory } from "react-router-dom";
import Stomper from "../../helpers/Stomp";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";

export const WinnerScreenSoloFast = (props) => {

    const history = useHistory();
  const params = useParams();
  let gameId = params.id;
  
    let webSocket = Stomper.getInstance();
  
    useEffect(() => {

      
      
      
    }, [props]);
  
      const exitGame = async () => {
        try {
          webSocket.leave("/topic/games/" + gameId + "/gamestart");
          webSocket.leave("/topic/games/" + gameId + "/newturn_gameheader");
          webSocket.leave("/topic/games/" + gameId + "/newturn");
          webSocket.leave("/topic/games/" + gameId + "/nextTurn");
          webSocket.leave("/topic/games/" + gameId + "/updatedturn");
          webSocket.leave("/topic/games/" + gameId + "/scoreboard");
          webSocket.leave("/topic/games/" + gameId + "/scoreboardOver");
          webSocket.leave("/topic/games/" + gameId + "/barrierHit");
          webSocket.leave("/topic/games/" + gameId + "/barrierquestion");
          webSocket.leave("/topic/games/" + gameId + "/gameover");
          // set status to offline
          await api.delete(
              `/games/${gameId}`,
              {headers: {"Authorization": JSON.parse(sessionStorage.getItem('token')).token}}
          );
          console.log("Left game");
          sessionStorage.removeItem("gameId");
          sessionStorage.removeItem('game');
  
          // redirect to home
          history.push('/');
      } catch (error) {
          console.log(`Something went wrong when leaving the game: \n${handleError(error)}`);
      }
      }
  
    return (
      <BaseContainer className="winner-screen container">
        <h1 style={{ margin: 0 }}>Congratulations!</h1>
        <h2 style={{ marginBottom: 40, textAlign: 'center' }}>
            You've blazed a trail across the game board and completed it in {Math.floor(props.playingTimeInSeconds / 60)} {Math.floor(props.playingTimeInSeconds / 60) === 1 ? 'minute' : 'minutes'} and {props.playingTimeInSeconds % 60} {props.playingTimeInSeconds % 60 === 1 ? 'second' : 'seconds'}!
        </h2>

  
          <Button style={{ marginTop: 40 }}
              onClick={() => {
                  exitGame();
              }}
          >
              Return to Homescreen
          </Button>
      </BaseContainer>
    );
}