import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CountryRanking.scss";
import Stomper from "../../helpers/Stomp";

const CountryRanking = props => {
    const history = useHistory();
    const gameId = useParams().id;
    let webSocket = Stomper.getInstance();

    // End Turn
    const endTurn = () => {
        // dummy
        history.push("/users");
    };

    // dummies
    let category = "Population"
    let playerNumber = 6
    let playerId = 3
    let countries = ["Switzerland", "Germany", "France", "Papua New Guinea", "Spain", "Japan"];

    // const [countries, setCountries] = useState(null);

    const setMarkerChecked = (markerId) => {
        document.getElementById(markerId).click();
    }

    function marker(countries) {
        let markerArr = []
        for (let i = 1; i <= countries.length; i++) {
            markerArr.push(
                <div>
                    <div className="country-ranking marker-container">
                        <label className="country-ranking marker-number" onClick={() => setMarkerChecked(`marker${i}`)}>{i}</label>
                        <input type="radio" name="marker" id={"marker" + i } className="marker-radio" value={"player" + playerId}/>
                    </div>
                </div>
            )
        }
        return markerArr
    }

    const setCountryChecked = (countryId) => {
        document.getElementById(countryId).click();
    }

    function country1(countries) {
        let countryArr = []
        for (let i = 0; i < 3; i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                        <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerId}/>
                    </div>
                </div>
            )
        }
        return countryArr
    };

    function country2(countries) {
        let countryArr = []
        for (let i = 3; i < countries.length; i++) {
            countryArr.push(
                <div>
                    <div className="country-ranking countries-container" onClick={() => setCountryChecked(`country${i}`)}>
                        <label className="country-ranking country-name" onClick={() => setCountryChecked(`country${i}`)}>{countries[i]}</label>
                        <input type="radio" name="country" id={"country" + i } className="country-ranking flag-container" value={"player" + playerId}/>
                    </div>
                </div>
            )
        }
        return countryArr
    };

    return (
        <BaseContainer className="country-ranking container">
            <h2>Category: {category}</h2>
            <p>When it's your turn, click on a country and
                a number to rank the country in relation to
                the other countries. Each country can only be chosen once.</p>
            <div className="country-ranking flag-rows">
                {country1(countries)}
            </div>
            <div className="country-ranking flag-rows">
                {country2(countries)}
            </div>
            <div className="country-ranking bottom-row">
                <div className="country-ranking number-row">
                    {marker(countries)}
                </div>
                <Button onClick={() => endTurn()}>
                    End Turn
                </Button>
            </div>
        </BaseContainer>
    );
}

export default CountryRanking;
