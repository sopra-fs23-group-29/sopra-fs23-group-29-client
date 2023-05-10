import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown, useTimer } from './useCountdown';
import Stomper from "../../helpers/Stomp";
import "styles/views/Countdown.scss";

let webSocket = Stomper.getInstance();

let timeIsUp = false;

const ShowCountdown = ({ minutes, seconds }) => {
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

const ShowTimer = ({ hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <a
        className="countdown-link"
      >
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </a>
    </div>
  );
};

function timeUpCountdown(gameId) {
  if (!timeIsUp) {
    console.log("time is up on countdown, send a message to /endGame");
    webSocket.send("/app/games/" + gameId + "/endGame", {
        message: "END GAME " + gameId,
      });
  }

  timeIsUp = true;

}

const CountdownTimer = ({ targetDate, gameId }) => {
  const [hours, minutes, seconds] = useCountdown(targetDate);

  if (minutes + seconds <= 0) {
    timeUpCountdown(gameId);
    return null;
  } else {
    return (
      <ShowCountdown
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

const Timer = (start) => {
  const [hours, minutes, seconds] = useTimer(start);

  return (
    <ShowTimer
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
};

export { CountdownTimer, Timer };