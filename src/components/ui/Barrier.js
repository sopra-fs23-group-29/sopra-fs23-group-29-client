import {Button} from 'components/ui/Button';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Barrier.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";

const Barrier = props => {
    // set these as const [] = useState... if possible
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance(); // TODO: bruchts das hie?
    let userToken = JSON.parse(sessionStorage.getItem('token')).token;

    // websocket variables
    const [correctResult, setCorrectResult] = useState(null);
    const [barrierQuestionEnum, setBarrierQuestionEnum] = useState(null);
    const [questionText, setQuestionText] = useState(null);
    const [answerOptions, setAnswerOptions] = useState([]);
    const [barrierPlayer, setBarrierPlayer] = useState([]);

    // country and flag
    const [country, setCountry] = useState(null);
    const [flag, setFlag] = useState(null);
    const [flagAlt, setFlagAlt] = useState(null);

    // barrier answer
    const [playerBarrierAnswer, setplayerBarrierAnswer] = useState(null); // TODO: change to playerId
    const [barrierAnswer, setBarrierAnswer] = useState(null);

    useEffect(() => {

        processBarrier(props);

    }, [props]);

    const processBarrier = props => {
        setBarrierQuestionEnum(props.barrierQuestion.barrierQuestionEnum);
        let text = props.barrierQuestion.questionText;
        let result = text.replace("this country", props.barrierQuestion.country.nameMap.common)
        setQuestionText(result);
        setCorrectResult(props.barrierQuestion.correctResult);

        // set player
        let player = new Player(props.playerAnswering);
        setplayerBarrierAnswer(player.id);
        setBarrierPlayer(player);
        document.getElementById("Barrier Question Container").style.borderColor = player.playerColor

        // set randomized answer options
        setAnswerOptions(shuffleArray(props.barrierQuestion.answerOptions))

        // set country
        setCountry(props.barrierQuestion.country.nameMap.common)
        setFlag(props.barrierQuestion.country.flagsMap.svg)
        setFlagAlt(props.barrierQuestion.country.flagsMap.alt)
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

    async function saveBarrierAnswer() {
        let chosenAnswer = document.getElementById("answerOptions" + barrierAnswer)
        let correctAnswer = document.getElementById("answerOptions" + correctResult)
        correctAnswer.style.backgroundColor = "green"
        setQuestionText("Good Job!")
        if (chosenAnswer !== correctAnswer) {
            chosenAnswer.style.backgroundColor = "red"
            setQuestionText("Wrong :(")
        }
        document.getElementById("saveBarrierAnswer").disabled = true;
        await new Promise(resolve => setTimeout(() => {webSocket.send(
            `/app/games/${gameId}/player/${playerBarrierAnswer}/resolveBarrierAnswer`,
            {
                userToken: userToken,
                guess: barrierAnswer,})}, 5000))
    }

    // set answer as checked when text is clicked
    const setAnswerChecked = (answerId) => {
        document.getElementById(answerId).click();
    }

    // answer elements
    function createAnswer(barrierAnswer) {
        if (barrierPlayer.userToken === userToken) {
                let answerArr = []
                for (let i = 0; i <= barrierAnswer.length-1; i++) {
                    answerArr.push(
                        <div>
                            <div className="barrier answer-option-container" onClick={() => setAnswerChecked(`answerOptions${answerOptions[i]}`)}>
                                <label className="barrier answer-option-number" onClick={() => setAnswerChecked(`answerOptions${answerOptions[i]}`)}>{answerOptions[i]}</label>
                                <input type="radio" name="answerOptions" id={"answerOptions" + answerOptions[i]} disabled={false} key={i} className="answer-radio" value={barrierPlayer.playerColor} onClick={() => setBarrierAnswer(answerOptions[i])}/>
                            </div>
                        </div>
                    )
                }
                return answerArr
        }
    }

    // set country as checked when text, container or else is clicked
    const setCountryChecked = (countryId) => {
        document.getElementById(countryId).click();
    }

    function enableSaveBarrierAnswer() {
        if (barrierPlayer.userToken && barrierAnswer !== null) {
            if (barrierPlayer.userToken === userToken) {
                return false
            }
        }
        return true
    }

    return (
        <BaseContainer className="barrier answer-container" id="Barrier Question Container">
            <h3>{questionText}</h3>
            <div className="barrier country-container">
                <div className="barrier country-name" onClick={() => setCountryChecked(country)}>{country}</div>
                <img src={flag} onClick={() => setCountryChecked(country)} alt={flagAlt} height="85em" style={{borderRadius: "0.75em", padding: "0.5em"}}/>
            </div>
            <div className="barrier answer-row">
                {createAnswer(answerOptions)}
            </div>
            <Button
                className="hidden-button"
                id="saveBarrierAnswer"
                width="100%"
                disabled ={enableSaveBarrierAnswer()}
                onClick={() => saveBarrierAnswer()}>
                Submit Answer
            </Button>
        </BaseContainer>
    );
}

export default Barrier;