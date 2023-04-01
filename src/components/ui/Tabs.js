import {Tab} from "./Tab";
import {useHistory, useParams} from "react-router-dom";

export default function Tabs() {
    const history = useHistory();
    const id = JSON.parse(localStorage.getItem('token')).id;

    const goToHome = () => {
        history.push("/home");
    }

    const goToProfile = () => {
        history.push(`/profile/${id}`);
    }

    const goToUsers = () => {
        history.push("/users");
    }

  return (
      //TODO tabs should show on which side user is
        <Tab className="tab container">
            <Tab
                className="tab primary-tab"
                onClick={() => goToHome()}
            >
              Home
            </Tab>
            <Tab
                className="tab primary-tab"
                onClick={() => goToProfile()}
            >
              Profile
            </Tab>
            <Tab
                className="tab primary-tab"
                onClick={() => goToUsers()}
            >
              User
            </Tab>
        </Tab>
  );
}