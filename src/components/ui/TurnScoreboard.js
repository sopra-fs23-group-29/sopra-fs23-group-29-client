import BaseContainer from "components/ui/BaseContainer"
import {Button} from 'components/ui/Button';
import "styles/views/TurnScoreboard.scss";
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Stomper from 'helpers/Stomp';


export const TurnScoreboard = (props) => {
    let test_data = 
        {
           "scoreboardEntries": 
           [
            {
                "playerId" : 0,
                "currentScore" : 1,
                "playerUsername" : "nilsils",
                "guessCountryCode" : "SOM",
                "guess" : 1,
                "playerColor" : "RED"
            },
            {
                "playerId" : 0,
                "currentScore" : 1,
                "playerUsername" : "nilsils",
                "guessCountryCode" : "EST",
                "guess" : 1,
                "playerColor" : "GREEN"
            },
            {
                "playerId" : 0,
                "currentScore" : 1,
                "playerUsername" : "nilsils",
                "guessCountryCode" : "GUY",
                "guess" : 1,
                "playerColor" : "BLUE"
            }
           ],
    
           "rankQuestion": {
            "questionType": "RANK",
            "rankQuestionCategory": "POPULATION",
            "questionText": "Which of these countries has the largest population?",
            "questionTextShort": "Population",
            "countryList": [
                {
                    "nameMap": {
                        "common": "Guyana",
                        "official": "Co-operative Republic of Guyana",
                        "nativeName": {
                            "eng": {
                                "official": "Co-operative Republic of Guyana",
                                "common": "Guyana"
                            }
                        }
                    },
                    "area": 214969.0,
                    "population": 786559,
                    "giniMap": {
                        "1998": 45.1
                    },
                    "capitalInfoMap": {
                        "latlng": [
                            6.8,
                            -58.15
                        ]
                    },
                    "flagsMap": {
                        "png": "https://flagcdn.com/w320/gy.png",
                        "svg": "https://flagcdn.com/gy.svg",
                        "alt": "The flag of Guyana has a green field with two isosceles triangles which share a common base on the hoist end. The smaller black-edged red triangle spanning half the width of the field is superimposed on the larger white-edged yellow triangle which spans the full width of the field."
                    },
                    "cioc": "GUY",
                    "bordersList": [
                        "BRA",
                        "SUR",
                        "VEN"
                    ],
                    "gini": 45.1,
                    "giniYear": "1998",
                    "capitalLatitude": 6.8,
                    "flagUrl": "https://flagcdn.com/gy.svg",
                    "name": "Guyana"
                },
                {
                    "nameMap": {
                        "common": "Estonia",
                        "official": "Republic of Estonia",
                        "nativeName": {
                            "est": {
                                "official": "Eesti Vabariik",
                                "common": "Eesti"
                            }
                        }
                    },
                    "area": 45227.0,
                    "population": 1331057,
                    "giniMap": {
                        "2018": 30.3
                    },
                    "capitalInfoMap": {
                        "latlng": [
                            59.43,
                            24.72
                        ]
                    },
                    "flagsMap": {
                        "png": "https://flagcdn.com/w320/ee.png",
                        "svg": "https://flagcdn.com/ee.svg",
                        "alt": "The flag of Estonia is composed of three equal horizontal bands of blue, black and white."
                    },
                    "cioc": "EST",
                    "bordersList": [
                        "LVA",
                        "RUS"
                    ],
                    "gini": 30.3,
                    "giniYear": "2018",
                    "capitalLatitude": 59.43,
                    "flagUrl": "https://flagcdn.com/ee.svg",
                    "name": "Estonia"
                },
                {
                    "nameMap": {
                        "common": "Somalia",
                        "official": "Federal Republic of Somalia",
                        "nativeName": {
                            "ara": {
                                "official": "جمهورية الصومال‎‎",
                                "common": "الصومال‎‎"
                            },
                            "som": {
                                "official": "Jamhuuriyadda Federaalka Soomaaliya",
                                "common": "Soomaaliya"
                            }
                        }
                    },
                    "area": 637657.0,
                    "population": 15893219,
                    "giniMap": {
                        "2017": 36.8
                    },
                    "capitalInfoMap": {
                        "latlng": [
                            2.07,
                            45.33
                        ]
                    },
                    "flagsMap": {
                        "png": "https://flagcdn.com/w320/so.png",
                        "svg": "https://flagcdn.com/so.svg",
                        "alt": "The flag of Somalia features a large five-pointed white star centered on a light blue field."
                    },
                    "cioc": "SOM",
                    "bordersList": [
                        "DJI",
                        "ETH",
                        "KEN"
                    ],
                    "gini": 36.8,
                    "giniYear": "2017",
                    "capitalLatitude": 2.07,
                    "flagUrl": "https://flagcdn.com/so.svg",
                    "name": "Somalia"
                }
            ]
        }
    }
    
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
                            <div>
                                <img src={country.flagUrl} alt={`${country.name} flag`} />
                            </div>
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