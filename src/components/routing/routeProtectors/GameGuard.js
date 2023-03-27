import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {api, handleError} from 'helpers/api';
import {useEffect, useState} from 'react';


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
Check with all the users currently registered in the server DB if the user with the token in localStorage
even exists. If not clear the localStorage and route to /login
*/

export const GameGuard = props => {

  // const [users, setUsers] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {

  //       // get only
  //       const response = await api.get('/users');
        
  //       // Get the returned users
  //       setUsers(response.data);

  //       console.log(response.data);
    
  //     } catch (error) {
  //       console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
  //       console.error("Details:", error);
  //       alert("Something went wrong while fetching the users! See the console for details.");
  //     }
  //   }
    
  //   fetchData();

  // }, []);

  // // console.log(users);

  // let match = false;
  // let currentToken = localStorage.getItem("token");

  // console.log(`currentToken: ${currentToken}`);

  // if (users) {
  //   for (let i = 0; i < users.length; i++) {
  //     const user = users[i];
  //     console.log("asdfasdf");
  //     console.log(`user ${user.id} with name ${user.username}`);
  //     if (user.id == currentToken) {
  //       match = true;
  //     }
  //   }
  // }

  // if (match) {
  //   return props.children;
  // }

  // // remove the token from localStorage
  // localStorage.removeItem("token");
  // return <Redirect to="/login"/>;


  if (localStorage.getItem("token")) {
    return props.children;
  }

  return <Redirect to="/login"/>;

};

GameGuard.propTypes = {
  children: PropTypes.node
};