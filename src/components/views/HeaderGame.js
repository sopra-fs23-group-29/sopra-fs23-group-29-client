import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";

const HeaderGame = props => (
  <div className="header container" style={{height: props.height}}>
      <Globalissimo/>
      <h2 className="header game username">[USERNAME]</h2>
      <p className="header game barrier-counter">[Barrier Counter]</p>
      <p className="header game round-counter">[Round Counter]</p>
      <i className="header game icon">logout</i>
  </div>
);

HeaderGame.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderGame;
