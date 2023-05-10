import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};



const useTimer = ({start}) => {

  const startDatetime = start;
  
  const [elapsedTime, setElapsedTime] = useState(
    new Date().getTime() - startDatetime -60000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(new Date().getTime() - startDatetime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDatetime]);

  return getReturnValues(elapsedTime);
};



const getReturnValues = (datetime) => {
  // calculate time left in minutes
  const hours = Math.floor(
    (datetime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((datetime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((datetime % (1000 * 60)) / 1000);

  return [hours, minutes, seconds];
};



export { useCountdown, useTimer };