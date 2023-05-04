import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";

const BoardSizeSelect = () => {
  const [boardSize, setBoardSize] = useState(null);

  return (
    <div>
      <div>Small</div>
      <div>Medium</div>
      <div>Large</div>
    </div>
  );
};

export default BoardSizeSelect;
