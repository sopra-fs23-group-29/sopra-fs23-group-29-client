import React, { useEffect, useState } from "react";
import "styles/ui/BoardSizeSelect.scss";

const DurationSelect = ({ changeDuration }) => {
  const [gameDuration, setGameDuration] = useState(null);
  const [isOpOne, setIsOpOne] = useState(false);
  const [isOpTwo, setIsOpTwo] = useState(false);
  const [isOpThree, setIsOpThree] = useState(false);

  const handleOne = () => {
    setIsOpOne(!isOpOne);
    setIsOpTwo(false);
    setIsOpThree(false);
  };

  const handleTwo = () => {
    setIsOpTwo(!isOpTwo);
    setIsOpOne(false);
    setIsOpThree(false);
  };

  const handleThree = () => {
    setIsOpThree(!isOpThree);
    setIsOpOne(false);
    setIsOpTwo(false);
  };

  useEffect(() => {
    if (isOpOne && !isOpTwo && !isOpThree) {
      setGameDuration("SHORT");
      changeDuration(gameDuration);
    } else if (isOpTwo && !isOpOne && !isOpThree) {
      setGameDuration("MEDIUM");
      changeDuration(gameDuration);
    } else if (isOpThree && !isOpOne && !isOpTwo) {
      setGameDuration("LONG");
      changeDuration(gameDuration);
    } else changeDuration(null);
  }, [isOpOne, isOpTwo, isOpThree, gameDuration]);

  return (
    <div className="toggle">
      {isOpOne ? (
        <button className="toggle button-active" onClick={() => handleOne()}>
          3 minutes
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleOne()}>
          3 minutes
        </button>
      )}
      {isOpTwo ? (
        <button className="toggle button-active" onClick={() => handleTwo()}>
          10 minutes
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleTwo()}>
          10 minutes
        </button>
      )}
      {isOpThree ? (
        <button className="toggle button-active" onClick={() => handleThree()}>
          20 minutes
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleThree()}>
          20 minutes
        </button>
      )}
    </div>
  );
};

export default DurationSelect;
