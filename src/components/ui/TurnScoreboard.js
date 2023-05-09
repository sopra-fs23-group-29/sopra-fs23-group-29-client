import BaseContainer from "components/ui/BaseContainer"
import {Button} from 'components/ui/Button';
import "styles/views/TurnScoreboard.scss";
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Stomper from 'helpers/Stomp';


export const TurnScoreboard = (props) => {
    
    const params = useParams();
    let userToken = JSON.parse(sessionStorage.getItem('token')).token;
    const [rankingQuestion, setRankingQuestion] = useState(props.rankingQuestion);
    const [scoreboardEntries, setScoreboardEntries] = useState(props.scoreboardEntries);
    const [willContinue, setWillContinue] = useState(false);

    let webSocket = Stomper.getInstance();

    useEffect(() => {
        setRankingQuestion(props.rankingQuestion);
        setScoreboardEntries(props.scoreboardEntries);
    }, [props]);

    // function to handle click on next turn button
    const handleContinue = () => {
        webSocket.send(
            `/app/games/${params.id}/readyMovePlayers`,
            {
                userToken: userToken
            }
        );
    }

    return (
        <BaseContainer className="turn-scoreboard container">
        <h1 style={{marginBottom: "0em"}}>Results of this round</h1>

        <div>
            <div className="turn-scoreboard table-row" style={{paddingBottom: "0"}}>
            <h3>Rank</h3>
            <div> </div>
            <div> </div>
            <h3 style={{display: 'flex', alignItems: 'center'}}>Guessed rank</h3>
            <div> </div>
            <div> </div>
            <h3>{rankingQuestion.questionTextShort.replace("^2", "²")}</h3>
            </div>
            {
                rankingQuestion.countryList.map((country, index) => {
                    // Find the player that guessed this country
                    const player = scoreboardEntries.find((p) => p.guessCountryCode == country.cioc);

                    let statistic;
                    switch (rankingQuestion.rankQuestionCategory) {
                        case "AREA":
                        statistic = country.area;
                        break;
                        case "POPULATION":
                        statistic = country.population;
                        break;
                        case "GINI":
                        statistic = country.gini.toFixed(2);
                        break;
                        case "POPULATION_DENSITY":
                        statistic = country.populationDensity.toFixed(2);
                        break;
                        case "CAPITAL_LATITUDE":
                        statistic = country.capitalLatitude.toFixed(2);
                        break;
                        // add more cases for other categories as needed
                        default:
                        statistic = "-";
                    }

                    return (
                        <div className="turn-scoreboard table-row">
                            <div>{index + 1}.</div>
                            <img src={country.flagUrl} alt={`${country.name} flag`} />
                            <div className="turn-scoreboard table-country-name">{country.name}</div>
                            <div style={{backgroundColor: player ? player.playerColor : 'transparent', borderRadius: '50%', width: '30px', height: '30px', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {player ? player.guess : ""}
                            </div>
                            <div>{player ? ">" : ""}</div>
                            <div>{player ? `${player.currentScore} ${player.currentScore === 1 ? 'Point' : 'Points'}` : ""}</div>
                            <div>{statistic}</div>
                        </div>
                        );
                    }
                )   
            }
        </div>
        
        {/* todo: maybe add timer which triggers automatically? */}
        <Button
            disabled={willContinue}
            onClick={() => {
                setWillContinue(true);
                handleContinue();
            }}
        >
            {willContinue ? "Waiting for other players to get ready .." : "Next Round"}
        </Button>
        
        </BaseContainer>
    );
    };