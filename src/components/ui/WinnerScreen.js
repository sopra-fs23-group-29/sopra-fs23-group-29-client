import BaseContainer from "./BaseContainer";
import "styles/views/WinnerScreen.scss";
import { Button } from "./Button";
import React from "react";
import { Barrier } from "./Barrier";

export const WinnerScreen = (props) => {

  let test_data = {
    "winnerList": [
      {
        "rank": 1,
        "username": "Nils1dfsdfs",
        "playercolor": "green",
        "answeredBarrierQuestions": 5
      },

      {
        "rank": 2,
        "username": "Nils2",
        "playercolor": "red",
        "answeredBarrierQuestions": 3
      },

      {
        "rank": 3,
        "username": "Nils3",
        "playercolor": "yellow",
        "answeredBarrierQuestions": 1
      },

      {
        "rank": 4,
        "username": "Nils4",
        "playercolor": "blue",
        "answeredBarrierQuestions": 1
      }
    ]
  }

    const exitGame = () => {console.log("exit game")}

  return (
    <BaseContainer className="winner-screen container">
      <h1 style={{ margin: 0 }}>Winner!</h1>
      <h2 style={{ marginBottom: 40 }}>{test_data.winnerList[0].username} is on top of the world right now!</h2>
      {test_data.winnerList.map((player) => (
        <div className="winner-screen table-row"
          key={player.username}
          
        >
            <span className="player-rank">{player.rank}.</span>
          <span
            style={{ backgroundColor: player.playercolor }}
            className="player-username"
          >
            {player.username}
          </span>
          
          <span className="player-barrier-questions" style={{marginRight: 0, marginLeft: 50}}>
            {player.answeredBarrierQuestions}
          </span>
          <span>
          <i className="barrier icon"
                   style={{color: player.playercolor, fontSize: "2em", marginLeft: "0" }}
                >
                    error_outlined</i>
        </span>
        
        </div>
      ))}

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
