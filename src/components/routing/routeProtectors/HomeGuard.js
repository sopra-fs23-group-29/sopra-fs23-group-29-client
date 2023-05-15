import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';


/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <HomeGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */

/*
Check with all the users currently registered in the server DB if the user with the token in sessionStorage
even exists. If not clear the sessionStorage and route to /login
*/

export const HomeGuard = props => {

  if (sessionStorage.getItem("token")) {
    return props.children;
  }

  return <Redirect to="/login"/>;

};

HomeGuard.propTypes = {
  children: PropTypes.node
};