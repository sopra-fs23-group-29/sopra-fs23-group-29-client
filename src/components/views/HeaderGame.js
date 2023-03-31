import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";

const HeaderGame = props => (
  <div className="header container" style={{height: props.height}}>
      <Globalissimo/>
      <h2 className="header username-game">[USERNAME]</h2>
  </div>
);

HeaderGame.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderGame;
