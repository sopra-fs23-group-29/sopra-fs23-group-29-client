import React, { useEffect, useState } from "react";
import "styles/ui/BoardSizeSelect.scss";

const BoardSizeSelect = ({ changeBoardSize }) => {
  const [boardSize, setBoardSize] = useState(null);
  const [isActiveSmall, setIsActiveSmall] = useState(false);
  const [isActiveMed, setIsActiveMed] = useState(false);
  const [isActiveLarge, setIsActiveLarge] = useState(false);

  const handleSmall = () => {
    setIsActiveSmall(!isActiveSmall);
    setIsActiveMed(false);
    setIsActiveLarge(false);
  };

  const handleMedium = () => {
    setIsActiveMed(!isActiveMed);
    setIsActiveLarge(false);
    setIsActiveSmall(false);
  };

  const handleLarge = () => {
    setIsActiveLarge(!isActiveLarge);
    setIsActiveSmall(false);
    setIsActiveMed(false);
  };

  useEffect(() => {
    if (isActiveLarge && !isActiveMed && !isActiveSmall) {
      setBoardSize("LARGE");
      changeBoardSize(boardSize);
    } else if (isActiveMed && !isActiveLarge && !isActiveSmall) {
      setBoardSize("MEDIUM");
      changeBoardSize(boardSize);
    } else if (isActiveSmall && !isActiveMed && !isActiveLarge) {
      setBoardSize("SMALL");
      changeBoardSize(boardSize);
    } else changeBoardSize(null);
  }, [isActiveLarge, isActiveMed, isActiveSmall, boardSize]);

  return (
    <div className="toggle">
      {isActiveSmall ? (
        <button className="toggle button-active" onClick={() => handleSmall()}>
          Small
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleSmall()}>
          Small
        </button>
      )}
      {isActiveMed ? (
        <button className="toggle button-active" onClick={() => handleMedium()}>
          Medium
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleMedium()}>
          Medium
        </button>
      )}
      {isActiveLarge ? (
        <button className="toggle button-active" onClick={() => handleLarge()}>
          Large
        </button>
      ) : (
        <button className="toggle button" onClick={() => handleLarge()}>
          Large
        </button>
      )}
    </div>
  );
};

export default BoardSizeSelect;
