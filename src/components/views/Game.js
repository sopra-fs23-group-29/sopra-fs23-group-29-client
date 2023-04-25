import {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {Board} from "../ui/Board";
import CountryRanking from "../ui/CountryRanking";
import { TurnScoreboard } from 'components/ui/TurnScoreboard';
import Stomper from 'helpers/Stomp';




const Game = props => {
    const history = useHistory();
    const params = useParams();
    let webSocket = Stomper.getInstance();
    webSocket.leave("/topic/games/" + params.id + "/lobby", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/newturn", function (message) {
        setCountryRankingProps(JSON.parse(message.body));
        setShowCountryRanking(true);
    });
    webSocket.join("/topic/games/" + params.id + "/updatedturn", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/scoreboard", function (message) {
        setShowCountryRanking(false);
        setTurnScoreboardProps(JSON.parse(message.body));
        
        setShowTurnScoreboard(true);
        setTimeout(() => {
            setShowTurnScoreboard(false);
            //here comes call to board with player and point array
          }, "5000");
    });
    webSocket.join("/topic/games/" + params.id + "/barrierquestion", function (message) {});
    webSocket.join("/topic/games/" + params.id + "/gameover", function (message) {});

    const [showCountryRanking, setShowCountryRanking] = useState(false);
    const [countryRankingProps, setCountryRankingProps] = useState({});

    const [showTurnScoreboard, setShowTurnScoreboard] = useState(false);
    const [turnScoreboardProps, setTurnScoreboardProps] = useState({});

    let roundNumber = 1;
    let content = (
        <BaseContainer className="round container">
            Round {roundNumber}
        </BaseContainer>
    );

    return (
        <BaseContainer className="game container">
            <Board>

            </Board>
            {content}
            {showCountryRanking && <CountryRanking {...countryRankingProps} />}
            {showTurnScoreboard && <TurnScoreboard {...turnScoreboardProps} />}
            <BaseContainer className="order container">
                <div>Username 1</div>
                <div>Username 2</div>
                <div>Username 3</div>
                <div>Username 4</div>
                <div>Username 5</div>
                <div>Username 6</div>
            </BaseContainer>
        </BaseContainer>
    );
}


export default Game;
