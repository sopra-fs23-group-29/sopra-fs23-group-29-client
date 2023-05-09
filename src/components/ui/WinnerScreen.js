import BaseContainer from "./BaseContainer";
import "styles/views/WinnerScreen.scss";
import { Button } from "./Button";
import React from "react";
import { useParams, useHistory } from "react-router-dom";
import Stomper from "../../helpers/Stomp";
import { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";

export const WinnerScreen = (props) => {

  const history = useHistory();
  const params = useParams();
  let gameId = params.id;

  /*let props = {
    "players": [
        {
            "id": 7,
            "userToken": "8b1a4c0d-4f11-4970-8f06-c54d2ea75cbd",
            "gameId": 6,
            "playerName": "nb",
            "token": "038add01-d83c-49c4-85a5-f0be52b7ba95",
            "playerColor": "INDIANRED",
            "isHost": true
        }
    ],
    "turnNumber": 4,
    "resolvedBarriers": [
        4,
        7
    ],
    "gameId": 6,
    "gameName": "fsdfsd",
    "gameStatus": "FINISHED",
    "gameMode": "PVP",
    "leaderboard": {
        "entries": [
            {
                "playerId": 7,
                "currentScore": 11,
                "playerName": "nb",
                "playerColor": "INDIANRED",
                "guess": 0
            }
        ]
    },
    "barrierLeaderboard": {
        "entries": [
            {
                "playerId": 7,
                "currentScore": 2,
                "playerName": "nb",
                "playerColor": "INDIANRED",
                "guess": 0
            }
        ]
    },
    "joinable": false,
    "boardSize": "SMALL",
    "boardSizeInt": 12,
    "maxDuration": "NA",
    "maxDurationInt": 0,
    "maxTurns": 0
}*/

  const reformatProperties = () => {
    // Loop through each object in the barrierScoreboard array
    barrierScoreboard.forEach(barrierObj => {
      // Find the object in the globalScoreboard array with the same playerName
      const globalObj = globalScoreboard.find(globalObj => globalObj.playerName === barrierObj.playerName);

      // If an object is found, update its barrierCurrentscore property with the currentScore value from barrierScoreboard
      if (globalObj) {

        globalObj.barrierCurrentScore = barrierObj.currentScore;

      }
    });

    // Sort the globalScoreboard array based on currentscore and barrierCurrentScore (in case of a tie)
    globalScoreboard.sort((a, b) => {
      if (b.currentscore === a.currentscore) {
        return b.barrierCurrentScore - a.barrierCurrentScore;
      } else {
        return b.currentscore - a.currentscore;
      }
    });
  }

  //const [players, setPlayers] = useState(props.players);
  const [globalScoreboard, setGlobalScoreboard] = useState(props.leaderboard.entries);
  const [barrierScoreboard, setBarrierScoreboard] = useState(props.barrierLeaderboard.entries);

  reformatProperties();

  let webSocket = Stomper.getInstance();

  useEffect(() => {

    setGlobalScoreboard(props.leaderboard.entries);
    setBarrierScoreboard(props.barrierLeaderboard.entries);

    reformatProperties();
    
    
    
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
      <h1 style={{ margin: 0 }}>Winner!</h1>
      <h2 style={{ marginBottom: 40 }}>{globalScoreboard[0].playerName} is on top of the world right now!</h2>

      <div>
      {globalScoreboard.map((player, index) => {
        return(
        <div className="winner-screen table-row"
          key={player.playerName}
          
        >
            <span className="player-rank">{index + 1}.</span>
          <span
            style={{ backgroundColor: player.playerColor }}
            className="player-username"
          >
            {player.playerName}
          </span>
          
          <span className="player-barrier-questions" style={{marginRight: 0, marginLeft: 50}}>
            {player.barrierCurrentScore}
          </span>
          <span>
          <i className="barrier icon"
                   style={{color: player.playerColor, fontSize: "2em", marginLeft: "0" }}
                >
                    error_outlined</i>
        </span>
        
        </div>
        )
      })}
      </div>

        <Button style={{ marginTop: 40 }}
            onClick={() => {
                exitGame();
            }}
        >
            Return to Homescreen
        </Button>
    </BaseContainer>
  );
  
};
