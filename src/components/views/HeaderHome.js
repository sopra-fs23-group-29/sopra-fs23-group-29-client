import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Globalissimo} from "../ui/Globalissimo";
import Tabs from "../ui/Tabs";
import {useHistory} from "react-router-dom";
import Stomper from "../../helpers/Stomp";
import {api, handleError} from "../../helpers/api";

const HeaderHome = props => {
    const username = JSON.parse(localStorage.getItem('token')).username;

    return (
        <div className="header container" style={{height: props.height}}>
          <Globalissimo/>
          <h2 className="header home username">{username}</h2>
          <Tabs/>
        </div>
    );
};

HeaderHome.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderHome;
