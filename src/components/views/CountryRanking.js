import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";

const CountryRanking = props => {
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();
    // dummies
    let playerId = 3
    let countryCode = "Switzerland"

    // websocket variables
    const [turnNumber, setTurnNumber] = useState(null);
    const [turnPlayers, setTurnPlayers] = useState(null);
    const [rankQuestion, setRankQuestion] = useState(null);
    const [takenGuesses, setTakenGuesses] = useState(null);

    // countries and flags
    const [countries, setCountries] = useState([]);
    const [flags, setFlags] = useState([]);
    const [flagAlt, setFlagAlt] = useState([]);

    // Player
    const [playerList, setPlayerList] = useState([]);

    // misc
    const [category, setCategory] = useState([]);
    const [checkedMarker, setCheckedMarker] = useState(null);
    const [checkedCountry, setCheckedCountry] = useState(null);


    useEffect(() => {
        async function fetchData() {
            /* subscribe to topic/games/{gameId} */
            //webSocket.join("/topic/games/" + gameId + "/newturn", processResponse);

            /* Get the current game */
            //webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });

        }
        fetchData();

        async function nextTurn() {
            webSocket.send("/app/games/" + gameId + "/nextTurn", { message: "NEXT TURN" });
        }

    }, []);

    const processResponse = message => {
        // set turnNumber
        setTurnNumber(JSON.parse(message.body).turnNumber);

        // set turnPlayers
        setTurnPlayers(JSON.parse(message.body).turnPlayers);

        // set rankQuestion
        setRankQuestion(JSON.parse(message.body).rankQuestion);

        // set takenGuesses
        setTakenGuesses(JSON.parse(message.body).takenGuesses);

        // set players
        for (let i = 0; i < JSON.parse(message.body).turnPlayers.length; i++) {
            let player = new Player(JSON.parse(message.body).turnPlayers[i])
            playerList.push(player)
        }

        // set country names
        for (let i = 0; i < JSON.parse(message.body).rankQuestion.countryList.length; i++) {
            countries.push(JSON.parse(message.body).rankQuestion.countryList[i].nameMap.common)
            flags.push(JSON.parse(message.body).rankQuestion.countryList[i].flagsMap.svg)
            flagAlt.push(JSON.parse(message.body).rankQuestion.countryList[i].flagsMap.alt)
        }

        // set category
        setCategory(JSON.parse(message.body).rankQuestion.questionTextShort)
    };


    // End Turn
    const saveAnswer = () => {
        /*
        webSocket.send(
            `/app/games/${gameId}/turn/${turnNumber}/player/${playerId}/saveAnswer`,
            {
                userToken: JSON.parse(sessionStorage.getItem("token")).token,
                countryCode: countryCode,
                takenGuesses: takenGuesses,
            }
            */
        // check which buttons are checked
        /*
        for (let i = 0; i < countries.length; i++) {
            let currentMarker = document.getElementById('marker' + [i]);
            let currentCountry = document.getElementById('country' + [i]);
            // checking if any radio button is selected
            if(currentMarker.checked){
                console.log("The radio button with value " + currentMarker.key + " is checked!");
            }
            if(currentCountry.checked){
                console.log("The radio button with value " + currentCountry.key + " is checked!");
            }
        }
         */
        console.log("turnNumber" + turnNumber)
        console.log("turnPlayers" + turnPlayers)
        console.log("rankQuestion" + rankQuestion)
        console.log("text" + rankQuestion.countryList[0].nameMap.common)
        console.log("takenGuesses" + takenGuesses)
        //console.log(document.querySelectorAll('input[name=marker]:checked'))
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
                        <input type="radio" name="marker" id={"marker" + i} className="marker-radio" value={"player" + playerId}/>
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
                <Button
                    id="saveAnswer"
                    onClick={() => saveAnswer()}>
                    End Turn
                </Button>
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
