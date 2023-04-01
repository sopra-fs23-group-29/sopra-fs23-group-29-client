import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import Tabs from "../ui/Tabs";

const HeaderHome = props => (
  <div className="header container" style={{height: props.height}}>
      <Globalissimo/>
      <h2 className="header home username">[USERNAME]</h2>
      <Tabs/>
  </div>
);

HeaderHome.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderHome;
