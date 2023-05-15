import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import { useParams } from 'react-router';


/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */

/*
Check with all the users currently registered in the server DB if the user with the token in sessionStorage
even exists. If not clear the sessionStorage and route to /login
*/

export const GameGuard = props => {

  // read the id from the route
  const params = useParams();
  
  if (sessionStorage.getItem("gameId") === params.id) {
    return props.children;
  }

  return <Redirect to="/"/>;

};

GameGuard.propTypes = {
  children: PropTypes.node
};