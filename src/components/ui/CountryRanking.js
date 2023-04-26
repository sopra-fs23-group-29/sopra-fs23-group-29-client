import {Button} from 'components/ui/Button';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";
import HeaderGame, {updateHeaderGame} from "../views/HeaderGame";

const CountryRanking = props => {
    // set these as const [] = useState... if possible
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();
    // dummies
    let userToken = JSON.parse(sessionStorage.getItem('token')).token;
    let playerColorId = 1

    // websocket variables
    const [turnNumber, setTurnNumber] = useState(null);
    const [turnPlayers, setTurnPlayers] = useState(null);
    const [rankQuestion, setRankQuestion] = useState(null);
    const [takenGuesses, setTakenGuesses] = useState(null);

    // countries and flags
    const [countries, setCountries] = useState([]);
    const [cioc, setCioc] = useState([]);
    const [flags, setFlags] = useState([]);
    const [flagAlt, setFlagAlt] = useState([]);

    // Player
    const [playerList, setPlayerList] = useState([]);
    const [yourPlayer, setYourPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    // misc
    const [category, setCategory] = useState(null);
    const [checkedMarker, setCheckedMarker] = useState(null);
    const [checkedCountry, setCheckedCountry] = useState(null);


    useEffect(() => {
        
        processNewTurn(props);

    }, [props.turnNumber]);

    useEffect(() => {

        processUpdatedTurn(props);

    }, [props.takenGuesses]);

    const processNewTurn = props => {
        // set turnNumber
        setTurnNumber(props.turnNumber);
        // set turnPlayers
        setTurnPlayers(props.turnPlayers);
        // set rankQuestion
        setRankQuestion(props.rankQuestion);
        // set takenGuesses
        setTakenGuesses(props.takenGuesses);

        // set players
        for (let i = 0; i < props.turnPlayers.length; i++) {
            let player = new Player(props.turnPlayers[i])
            if (player.userToken === userToken) {
                setYourPlayer(player)
                //next doesn't work
                //HeaderGame.updateHeaderGame(turnNumber, player.playerColor, gameId)
            }
            if (i === props.takenGuesses.length) {
                setCurrentPlayer(player)
                document.getElementById("Country Ranking Container").style.borderColor = player.playerColor
            }
            playerList.push(player)
        }
        let randomizedCountries = shuffleArray(props.rankQuestion.countryList)

        // set countries
        for (let i = 0; i < randomizedCountries.length; i++) {
            countries.push(randomizedCountries[i].nameMap.common)
            cioc.push(randomizedCountries[i].cioc)
            flags.push(randomizedCountries[i].flagsMap.svg)
            flagAlt.push(randomizedCountries[i].flagsMap.alt)
        }

        // set category
        setCategory(props.rankQuestion.questionText)
    };
    /*
               TODO set color of countries to chosen color by player guesses and set as unclickable
             */

    const processUpdatedTurn = (message) => {
        // set takenGuesses
        setTakenGuesses(props.takenGuesses);

        for (let i = 0; i < props.turnPlayers.length; i++) {
            let player = new Player(props.turnPlayers[i])
            if (i === props.takenGuesses.length) {
                setCurrentPlayer(player)
                document.getElementById("Country Ranking Container").style.borderColor = player.playerColor
            }
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    const saveAnswer = () => {
        webSocket.send(
            `/app/games/${gameId}/turn/${turnNumber}/player/${yourPlayer.id}/saveAnswer`,
            {
                userToken: userToken,
                countryCode: checkedCountry,
                guess: checkedMarker,
            }
        );
    };

    // set marker as checked when text is clicked
    const setMarkerChecked = (markerId) => {
        document.getElementById(markerId).click();
    }

    // marker elements
    function createMarker(countries) {
        let marker = []
        for (let i = 1; i <= countries.length; i++) {
            marker.push(
                <div>
                    <div className="country-ranking marker-container">
                        <label className="country-ranking marker-number" onClick={() => setMarkerChecked(`marker${i}`)}>{i}</label>
                        <input type="radio" name="marker" id={"marker" + i} className="marker-radio" value={currentPlayer.playerColor} key={i} onClick={() => setCheckedMarker(i)}/>
                    </div>
                </div>
            )
        }
        return marker
    }

    // set country as checked when text, container or else is clicked
    const setCountryChecked = (countryId) => {
        document.getElementById(countryId).click();
    }

    // country elements
    function country1(countries) {
        let countryArr = []
        for (let i = 0; i < countries.length-2; i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                        <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={currentPlayer.playerColor} onClick={() => setCheckedCountry(cioc[i])}/>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                        <img src={flags[i]} onClick={() => setCountryChecked(`country${i}`)} alt={flagAlt[i]} height="85em" style={{borderRadius: "0.75em", padding: "0.5em"}}/>
                    </div>
                </div>
            )
        }
        return countryArr
    }
    function country2(countries) {
        if (countries.length > 3) {
            let countryArr = []
            for (let i = 3; i < countries.length; i++) {
                countryArr.push(
                    <div>
                        <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                            <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={currentPlayer.playerColor} onClick={() => setCheckedCountry(cioc[i])}/>
                            <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                            <img src={flags[i]} onClick={() => setCountryChecked(`country${i}`)} alt={flagAlt[i]} height="85em" style={{borderRadius: "0.75em", padding: "0.5em"}}/>
                        </div>
                    </div>
                )
            }
            return countryArr
        }
    }

    return (
        <BaseContainer className="country-ranking container" id="Country Ranking Container">
            <h3>{category}</h3>
            <div className="country-ranking flag-rows">
                {country1(countries)}
            </div>
            <div className="country-ranking flag-rows">
                {country2(countries)}
            </div>
            <div className="country-ranking bottom-row">
                <div className="country-ranking number-row">
                    {createMarker(countries)}
                </div>
                <Button
                    id="saveAnswer"
                    disabled={currentPlayer ? currentPlayer.id !== yourPlayer.id : true}
                    onClick={() => saveAnswer()}>
                    Submit Answer
                </Button>
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
