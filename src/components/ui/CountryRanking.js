import {Button} from 'components/ui/Button';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";

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
        
        //webSocket.join("/topic/games/" + gameId + "/updatedturn", processUpdatedTurn);

        processNewTurn(props);

    }, [props.turnNumber]);

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
                sessionStorage.setItem('game', JSON.stringify({
                    "turnNumber": props.turnNumber,
                    "playerColor": player.playerColor,
                }
                ));
            }
            if (i === props.takenGuesses.length) {
                setCurrentPlayer(player)
            }
            playerList.push(player)
        }

        // set country names
        for (let i = 0; i < props.rankQuestion.countryList.length; i++) {
            countries.push(props.rankQuestion.countryList[i].nameMap.common)
            cioc.push(props.rankQuestion.countryList[i].cioc)
            flags.push(props.rankQuestion.countryList[i].flagsMap.svg)
            flagAlt.push(props.rankQuestion.countryList[i].flagsMap.alt)
        }

        // set category
        setCategory(props.rankQuestion.questionTextShort)
    };
    /*
    const processUpdatedTurn = (message) => {
        // set takenGuesses
        setTakenGuesses(JSON.parse(message.body).takenGuesses);

        if (JSON.parse(message.body).takenGuesses.length === JSON.parse(message.body).turnPlayers.length) {
            saveAnswer()
        }
    };
*/
    // End Turn
    const saveAnswer = () => {
        webSocket.send(
            `/app/games/${gameId}/turn/${turnNumber}/player/${yourPlayer.id}/saveAnswer`,
            {
                userToken: userToken,
                countryCode: checkedCountry,
                guess: checkedMarker,
            }
        );
        //console.log(takenGuesses.length)
        };
    const nextTurn = () => {
        setCountries([])
        setFlags([])
        setFlagAlt([])
        setCioc([])
        setPlayerList([])
        webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });
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
                        <input type="radio" name="marker" id={"marker" + i} className="marker-radio" value={"player" + playerColorId} key={i} onClick={() => setCheckedMarker(i)}/>
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
                        <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerColorId} onClick={() => setCheckedCountry(cioc[i])}/>
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
                            <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerColorId} onClick={() => setCheckedCountry(cioc[i])}/>
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
            <div className="country-ranking flag-rows">
                {country2(countries)}
            </div>
            <div className="country-ranking bottom-row">
                <div className="country-ranking number-row">
                    {createMarker(countries)}
                </div>
                <Button
                    id="saveAnswer"
                    onClick={() => saveAnswer()}>
                    Submit Answer
                </Button>
                {/*<Button
                    id="nextTurn"
                    onClick={() => nextTurn()}>
                    Next Turn
                </Button>*/}
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
