import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import {RegistrationGuard} from "components/routing/routeProtectors/RegistrationGuard";
import {ProfileGuard} from "components/routing/routeProtectors/ProfileGuard";
import Registration from "components/views/Registration";
import Profile from "components/views/Profile"
import ProfileEdit from "components/views/ProfileEdit"
import Home from "../../views/Home";
import Users from "../../views/Users";
import HeaderHome from "../../views/HeaderHome";
import Header from "../../views/Header";
import HeaderGame from "../../views/HeaderGame";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>

        <Route path="/game">
          <GameGuard>
            <HeaderGame/>
            <GameRouter base="/game"/>
          </GameGuard>
        </Route>

        <Route exact path="/login">
          <LoginGuard>
            <Header height="100"/>
            <Login/>
          </LoginGuard>
        </Route>

        <Route exact path="/registration">
          <RegistrationGuard>
            <Header height="100"/>
            <Registration/>
          </RegistrationGuard>
        </Route>
        //TODO Add guards
        <Route exact path="/">
            <HeaderHome height="100"/>
            <Home/>
        </Route>

        //TODO Add ProfileGuard here
        <Route exact path="/profile/:id">
          <HeaderHome height="100"/>
          <Profile/>
        </Route>

        <Route exact path="/profile/:id/edit">
          <HeaderHome height="100"/>
          <ProfileEdit/>
        </Route>

        <Route exact path="/users">
          <HeaderHome height="100"/>
          <Users/>
        </Route>


      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
