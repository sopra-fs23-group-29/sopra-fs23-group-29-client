import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import "styles/views/Profile.scss";

const Profile = props => {

  console.log(props);

  // Get the id param from the URL.
  let id = props.match.params.id;

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [userid, setUserid] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [birthday, setBirthday] = useState(null);

  const backToGame = () => {
    history.push('/game');
  }

  const edit = (id) => {
    history.push(`/profile/${id}/edit`);
  }
  
  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        
        const response = await api.get(
          `/users/${id}`,
          {headers:{"Authorization": JSON.parse(localStorage.getItem('token')).token}}
        );
        
        setUserid(response.data.id);
        setUsername(response.data.username);
        setToken(response.data.token);
        setStatus(response.data.status);
        setCreationDate(response.data.creationDate);
        setBirthday(response.data.birthday);

      } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

  return (

    <div>
      <BaseContainer className="profile container">
        <h2>Profile Page</h2>
        <div className="profile paragraph">
          {`User ID: ${userid}`}
        </div>
        <div className="profile paragraph">
          {`Username: ${username}`}
        </div>
        <div className="profile paragraph">
          {`Status: ${status}`}
        </div>
        <div className="profile paragraph">
          {`User Created: ${creationDate}`}
        </div>
        <div className="profile paragraph">
          {`Birthday: ${birthday}`}
        </div>

      </BaseContainer>

      <BaseContainer className = "game container">
        <div>
          <Button
            widht = "100%"
            disabled = {token !== JSON.parse(localStorage.getItem('token')).token}
            onClick = {() => edit(id)}
          >
            Edit Profile (ony for own profile)
          </Button>
        </div>

        <div className="game paragraph">{"----"}</div>
        
        <div>
          <Button width = "100%" onClick = {() => backToGame()}>Back to the Dashboard</Button>
        </div>

        <div>
          {`Logged in with ID - Username`}
        </div>
        <div>
          {`${JSON.parse(localStorage.getItem('token')).id} - ${JSON.parse(localStorage.getItem('token')).username}`}
        </div>
        
      </BaseContainer>
    </div>
    );

}

export default Profile;
