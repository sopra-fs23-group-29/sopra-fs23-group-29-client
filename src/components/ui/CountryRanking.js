import {Button} from 'components/ui/Button';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";

// todo: When a player leaves the game, players should be updated otherwise the answering cannot be done

const CountryRanking = props => {
    // set these as const [] = useState... if possible
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();
    let userToken = JSON.parse(sessionStorage.getItem('token')).token;

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
        if (true) {
            let tempCountries = []
            let tempCioc = []
            let tempFlags = []
            let tempFlagAlt = []
            for (let i = 0; i < randomizedCountries.length; i++) {
                tempCountries.push(randomizedCountries[i].nameMap.common)
                tempCioc.push(randomizedCountries[i].cioc)
                tempFlags.push(randomizedCountries[i].flagsMap.svg)
                tempFlagAlt.push(randomizedCountries[i].flagsMap.alt)
            }
            setCountries(tempCountries)
            setCioc(tempCioc)
            setFlags(tempFlags)
            setFlagAlt(tempFlagAlt)
        }


        // set category
        setCategory(props.rankQuestion.questionText.replace("^2", "²"))
    };

    const processUpdatedTurn = (message) => {
        if (checkedCountry !== null) {
            document.getElementById(checkedCountry).checked = false;
            setCheckedCountry(null)
        }
        // set takenGuesses
        setTakenGuesses(props.takenGuesses);

        for (let i = 0; i < props.takenGuesses.length; i++) {
            let guessCountryId = props.takenGuesses[i].guessCountryCode
            let guessColor = props.takenGuesses[i].guessPlayerColor
            document.getElementById(guessCountryId).style.backgroundColor = guessColor;
            document.getElementById(guessCountryId).disabled = true;
            document.getElementById(guessCountryId).parentElement.style.opacity = 0.5;
            document.getElementById(guessCountryId).parentElement.style.backgroundColor = guessColor;
        }

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
        if (currentPlayer) {
            if (currentPlayer.id === yourPlayer.id) {
                let marker = []
                for (let i = 1; i <= countries.length; i++) {
                    marker.push(
                        <div>
                            <div className="country-ranking marker-container">
                                <label className="country-ranking marker-number" onClick={() => setMarkerChecked(`marker${i}`)}>{i}</label>
                                <input type="radio" name="marker" id={"marker" + i} disabled={false} className="marker-radio" value={currentPlayer.playerColor} key={i} onClick={() => setCheckedMarker(i)}/>
                            </div>
                        </div>
                    )
                }
                return marker
            }
        }
    }

    // set country as checked when text, container or else is clicked
    const setCountryChecked = (countryId) => {
        if (currentPlayer.id === yourPlayer.id) {
            document.getElementById(countryId).click();
        }
    }

    // country elements
    function country1(countries) {
        let countryArr = []
        for (let i = 0; i < Math.min(3, countries.length); i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(cioc[i])}>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(cioc[i])}>{countries[i]}</label>
                        <input type="radio" name="country" id={cioc[i]} disabled={false} className="country-ranking flag-container" value={currentPlayer.playerColor} onClick={() => setCheckedCountry(cioc[i])}/>
                        <img src={flags[i]} onClick={() => setCountryChecked(cioc[i])} alt={flagAlt[i]} height="80em" style={{borderRadius: "0.25em", margin: "1em"}}/>
                    </div>
                </div>
            )
        }

        return countryArr
    }
    function country2(countries) {
        let countryArr = []
        for (let i = 3; i < Math.max(3, countries.length); i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(cioc[i])}>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(cioc[i])}>{countries[i]}</label>
                        <input type="radio" name="country" id={cioc[i]} disabled={false} className="country-ranking flag-container" value={currentPlayer.playerColor} onClick={() => setCheckedCountry(cioc[i])}/>
                        <img src={flags[i]} onClick={() => setCountryChecked(cioc[i])} alt={flagAlt[i]} height="80em" style={{borderRadius: "0.25em", margin: "1em"}}/>
                    </div>
                </div>
            )
        }
        return countryArr
    }

    function enableSaveAnswer() {
        if (currentPlayer && checkedCountry !== null && checkedMarker !== null) {
            if (currentPlayer.id === yourPlayer.id) {
                return false
            }
        }
        return true
    }

    return (
        <BaseContainer className="country-ranking container" id="Country Ranking Container">
            <h2>{category}</h2>
            <div className="country-ranking flag-rows">
                {country1(countries)}
            </div>
            <div className="country-ranking flag-rows">
                {country2(countries)}
            </div>
            <div className="country-ranking bottom-row">
                <div style={{width: "10em"}}></div>
                <div className="country-ranking number-row">
                    {createMarker(countries)}
                </div>
                <Button
                    className="hidden-button"
                    id="saveAnswer"
                    disabled ={enableSaveAnswer()}
                    onClick={() => saveAnswer()}
                    width="10em"
                >
                    Submit Answer
                </Button>
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
