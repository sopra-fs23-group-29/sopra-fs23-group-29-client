import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import "styles/views/Profile.scss";

const Profile = () => {

  const history = useHistory();
  const id = useParams().id;
  const activeId = JSON.parse(localStorage.getItem('token')).id;

  const [aUser, setAUser] = useState(null);

  const edit = () => {
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

        setAUser(response.data);

      } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

    let editButton = null;

    if (activeId.toString().valueOf() === id.valueOf()) {
        editButton = (
            <Button className="primary-button"
                    onClick={() => edit()}
            >
                Edit Profile
            </Button>
        );
    }

  let content = null;

  if (aUser) {
    content = (
        <div>
            <div className="profile container sections">
                <div className="profile container sections row">
                    <h2 className="profile username">{aUser.username}</h2>
                        {editButton}
                </div>
                <div className="profile container sections row">
                    <div className="profile container sections">
                        <p>Visited Countries: [STRING]</p>
                        <p>Birthday: [{aUser.birthday}]</p>
                        <p>About Me: [STRING]</p>

                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
      <BaseContainer className="profile container">
          {content}
      </BaseContainer>
  );
}

export default Profile;
