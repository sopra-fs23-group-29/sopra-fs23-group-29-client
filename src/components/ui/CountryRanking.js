import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";
import {useEffect, useState} from "react";

const CountryRanking = props => {
    let test_data =
        {
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
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();
    // dummies
    let category = test_data.rankQuestion.questionTextShort
    let playerId = 3
    let countryCode = "Switzerland"

    const [game, setGame] = useState(null)
    const [countries, setCountries] = useState([]);
    const [flags, setFlags] = useState([]);
    const [flagAlt, setFlagAlt] = useState([]);
    const [turnNumber, setTurnNumber] = useState(null);
    const [turnPlayers, setTurnPlayers] = useState(null);
    const [rankQuestion, setRankQuestion] = useState(null);
    const [guess, setGuess] = useState(2);

    // set country names
    for (let i = 0; i < test_data.rankQuestion.countryList.length; i++) {
        countries.push(test_data.rankQuestion.countryList[i].nameMap.common)
        flags.push(test_data.rankQuestion.countryList[i].flagsMap.svg)
        flagAlt.push(test_data.rankQuestion.countryList[i].flagsMap.alt)
    }

    const [gameInfo, setGameInfo] = useState(null);

    useEffect(() => {
        async function fetchData() {
            /* subscribe to topic/games/{gameId} */
            webSocket.join("/topic/games/" + gameId, processResponse);

            /* Get the current game */
            //webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });

        }
        fetchData();

        async function nextTurn() {
            webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });
        }

    }, [gameInfo]);

    const processResponse = message => {
        setGameInfo(JSON.parse(message.body));
    };


    const getCountries = () => {
        webSocket.addEventListener("message", ({ data }) => {
            const event = JSON.parse(data);
        });
    }

    // End Turn
    const saveAnswer = () => {
        /*
        webSocket.send(
            `/app/games/${gameId}/turn/${turnNumber}/player/${playerId}/saveAnswer`,
            {
                userToken: JSON.parse(localStorage.getItem("token")).token,
                countryCode: countryCode,
                guess: guess,
            }
            */
        webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });
    };

    // set marker as checked when text is clicked
    const setMarkerChecked = (markerId) => {
        document.getElementById(markerId).click();
    }

    // marker elements
    function marker(countries) {
        let markerArr = []
        for (let i = 1; i <= countries.length; i++) {
            markerArr.push(
                <div>
                    <div className="country-ranking marker-container">
                        <label className="country-ranking marker-number" onClick={() => setMarkerChecked(`marker${i}`)}>{i}</label>
                        <input type="radio" name="marker" id={"marker" + i } className="marker-radio" value={"player" + playerId}/>
                    </div>
                </div>
            )
        }
        return markerArr
    }

    // set country as checked when text, container or else is clicked
    const setCountryChecked = (countryId) => {
        document.getElementById(countryId).click();
    }

    // country elements
    function country1(countries) {
        let countryArr = []
        for (let i = 0; i < countries.length; i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                        <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerId}/>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                        <img src={flags[i]} onClick={() => setCountryChecked(`country${i}`)} alt={flagAlt[i]} height="85em" style={{borderRadius: "0.75em", padding: "0.5em"}}/>
                    </div>
                </div>
            )
        }
        return countryArr
    }
    /* second row
    function country2(countries) {
        if (countries.length > 3) {
            let countryArr = []
            for (let i = 3; i < countries.length; i++) {
                countryArr.push(
                    <div>
                        <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                            <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                            <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerId}/>
                        </div>
                    </div>
                )
            }
            return countryArr
        }
    }
     */

    return (
        <BaseContainer className="country-ranking container">
            <h2>Category: {category}</h2>
            <p>
                When it's your turn, click on a country and
                a number to rank the country in relation to
                the other countries. Each country can only be chosen once.
            </p>
            <div className="country-ranking flag-rows">
                {country1(countries)}
            </div>
            <div className="country-ranking bottom-row">
                <div className="country-ranking number-row">
                    {marker(countries)}
                </div>
                <Button onClick={() => saveAnswer()}>
                    End Turn
                </Button>
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
