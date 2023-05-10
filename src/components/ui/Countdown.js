import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from './useCountdown';
import Stomper from "../../helpers/Stomp";
import "styles/views/Countdown.scss";

let webSocket = Stomper.getInstance();

let timeIsUp = false;

const ShowCounter = ({ minutes, seconds }) => {
  return (
    <div className="show-counter">
      <a
        className="countdown-link"
      >
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </a>
    </div>
  );
};

function timeUp(gameId) {
  if (!timeIsUp) {
    console.log("time is up, send a message to /endGame");
    webSocket.send("/app/games/" + gameId + "/endGame", {
        message: "END GAME " + gameId,
      });
  }

  timeIsUp = true;

}

const CountdownTimer = ({ targetDate, gameId }) => {
  const [minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds <= 0) {
    timeUp(gameId);
    return null;
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;