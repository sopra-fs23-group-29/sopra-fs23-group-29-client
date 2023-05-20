import React, {useState} from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown, useTimer } from './useCountdown';
import Stomper from "../../helpers/Stomp";
import "styles/ui/Countdown.scss";

let webSocket = Stomper.getInstance();

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

  // dont allow neg numbers
  hours = Math.max(hours, 0);
  minutes = Math.max(minutes, 0);
  seconds = Math.max(seconds, 0);

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
  webSocket.send("/app/games/" + gameId + "/endGame", {
    message: "END GAME " + gameId,
  });
}

const CountdownTimer = ({ targetDate, gameId }) => {
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [hours, minutes, seconds] = useCountdown(targetDate);
  
  if (hours + minutes + seconds <= 0) {
    if (timeIsUp === false) {
      timeUpCountdown(gameId);
      setTimeIsUp(true);
    }
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