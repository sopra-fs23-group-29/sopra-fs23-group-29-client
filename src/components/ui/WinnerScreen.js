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

  //const [players, setPlayers] = useState(props.players);
  const [globalScoreboard, setGlobalScoreboard] = useState(props.leaderboard);
  const [barrierScoreboard, setBarrierScoreboard] = useState(props.barrierScoreboard);

  useEffect(() => {
    setGlobalScoreboard(props.leaderboard);
    setBarrierScoreboard(props.barrierScoreboard);

    
    // Loop through each object in the barrierScoreboard array
    barrierScoreboard.forEach(barrierObj => {
      // Find the object in the globalScoreboard array with the same playerName
      const globalObj = globalScoreboard.find(globalObj => globalObj.playerName === barrierObj.playerName);

      // If an object is found, update its currentscore property with the value from barrierScoreboard
      if (globalObj) {
        globalObj.currentscore = barrierObj.currentscore;
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
                   style={{color: player.playercolor, fontSize: "2em", marginLeft: "0" }}
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
