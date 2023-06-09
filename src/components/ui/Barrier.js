import {Button} from 'components/ui/Button';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/ui/Barrier.scss";
import Stomper from "../../helpers/Stomp";
import React, {useEffect, useState} from "react";
import Player from "../../models/Player";

const Barrier = props => {
    // set these as const [] = useState... if possible
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();
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
    const [playerBarrierAnswer, setplayerBarrierAnswer] = useState(null);
    const [barrierAnswer, setBarrierAnswer] = useState(null);

    useEffect(() => {

        processBarrier(props);

    }, [props]);

    const processBarrier = props => {
        document.getElementsByName("answerOptionsLabel").forEach(setEnabled)
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
        enableAnswerOptions()
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
    const setDisabled = (item) => {
        item.disabled = true;
    }
    const setEnabled = (item) => {
        item.disabled = false;
        item.style.all = "revert"
        item.parentElement.style.all = "revert"
    }

    async function saveBarrierAnswer() {
        let chosenAnswer = document.getElementById("answerOptionsLabel" + barrierAnswer)
        let correctAnswer = document.getElementById("answerOptionsLabel" + correctResult)
        document.getElementsByName("answerOptions").forEach(setDisabled)
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
                guess: barrierAnswer,})}, 3000))
    }

    // set answer as checked when text is clicked
    const enableAnswerOptions = () => {
        if (barrierPlayer.userToken === userToken) {
            document.getElementsByName("answerOptions").disabled = false;
        }
    }

    const setAnswerIfAllowed = (answer) => {
        if (barrierPlayer.userToken === userToken) {
            setBarrierAnswer(answer);
        }
    }

    // answer elements
    function createAnswer(barrierAnswer) {
        let answerArr = []
        for (let i = 0; i <= barrierAnswer.length-1; i++) {
            answerArr.push(
                <div style={{textAlign: "center"}} key={i}>
                    <input type="radio" name="answerOptions" id={"answerOptions" + answerOptions[i]} disabled={barrierPlayer.userToken !== userToken} key={i} value={barrierPlayer.playerColor} onClick={() => setAnswerIfAllowed(answerOptions[i])}/>
                    <label htmlFor={"answerOptions" + answerOptions[i]} name="answerOptionsLabel" id={"answerOptionsLabel" + answerOptions[i]}>{answerOptions[i]}</label>
                </div>
            )
        }
        return answerArr
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
            <h3 style={{marginTop: 0}}>{questionText}</h3>
            <div className="barrier country-container">
                <img src={flag} alt={flagAlt} height="100em" style={{borderRadius: "0.75em", padding: "0.5em"}}/>
            </div>
            {barrierPlayer.userToken !== userToken ?
                <div style={{textAlign: "center", marginBottom: "1em"}}>
                    <p>Please wait while the other player answers the barrier question.</p>
                </div> : <div></div>
            }
            <div className="barrier answer-row">
                {createAnswer(answerOptions)}
            </div>
            <Button
                className="hidden-button"
                id="saveBarrierAnswer"
                width="62%"
                disabled ={enableSaveBarrierAnswer()}
                onClick={() => saveBarrierAnswer()}>
                Submit Answer
            </Button>
        </BaseContainer>
    );
}

export default Barrier;