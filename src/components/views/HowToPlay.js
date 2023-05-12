import React from "react";
import "styles/views/HowToPlay.scss";
import BaseContainer from "components/ui/BaseContainer";

const HowToPlay = () => {
  return (
    <BaseContainer>
      <div className="howto container">
        <h2>How to Play</h2>
        <div>
          Hi and welcome to our game manual! Here, you'll learn all you need to
          know to play a multiplayer or solo game.
        </div>
        <div>
          <h3 className="howto title">Multiplayer Game</h3>
          <div>
            Once you have joined a multiplayer game, you will ge given a colour.
            You can see which colour was assigned to you and each of the other
            players at the very top of the screen. The first round begins
            immeadiately when the game is started. In the middle of the screen,
            you'll see the first question, five or six countries with their
            corresponding flag, and the numbers from one to five or six,
            depending on the number of countries.
          </div>
          <h5 className="howto second-title">Completing a round</h5>
          <div>
            {" "}
            Now, all players are going to take turn and enter their guess one by
            one. The edge of the playing board will appear in the colour of the
            player whosever turn it is. Only this player can make a move.
          </div>
          <div>
            When it's your turn to make a move, select one country and one
            number by clicking them, and then click "Submit Answer" to enter
            your guess. If the question asks for the country with the largest
            surface area, selecting the number "1" for a country means that your
            guess is that this country has the largest surface area out of all
            the displayed countries. Thus, selecting number "2" means that the
            country has the second largest surface area, and so on.
          </div>
          <div>
            There is a twist. You can only select countries and numbers that
            have not been used by other players for their guesses. Assume two
            players locked in their answers ahead of your turn and there are a
            total of five countries being displayed: You can now only choose
            from the remaining three countries and three numbers that those two
            players haven't used.
          </div>
          <div>
            Whilst the other players are completing their turns, you can see
            which player has guessed on which country by the coloured edge
            around the country's flag.
          </div>
          <h5 className="howto second-title">
            Getting points and advancing on the gameboard
          </h5>
          <div>
            After every player has entered their guess, points are given out
            following this scheme:
          </div>
          <div>3 points: Guessed the exact rank of the country</div>
          <div>
            2 points: Guessed one rank too high or too low for the country
          </div>
          <div>
            1 point: Guessed two ranks too high or too low for the country
          </div>
          <div>
            Then the tokens of all playes advance on the gameboard by as many
            fields as points the player has scored.
          </div>
          <h5 className="howto second-title">Barrier questions</h5>
          <div>
            To add one more challenge, there are barrier on the gameboard that
            can only be passed by tokens an additional question has been
            answered correctly. The first player whose token reaches a barrier
            will be asked to answer the barrier question. All other players can
            see the question, but cannot answer.
          </div>
          <div>
            If the question is answered correctly, the barrier disappears for
            all players.{" "}
          </div>
          <div>
            If the answer was wrong, the token of the player who failed to
            answer correctly cannot advance and the barrier remains. Another
            barrier question will be posed to the next player whose token is
            trying to pass the question.
          </div>
          <h5 className="howto second-title">Winning</h5>
          <div>
            Once a token reaches the end of the gameboard, this player wins.
            Should two or more player reach the finish line in the same round,
            the player who answered the most barrier questions wins.
          </div>
        </div>
        <div>
          <h3 className="howto title">Solo Game</h3>
          <div>
            A solo game is played the same as a multiplayer game, but since you
            are not competing against other players, there are two game modes to
            choose from to challenge you. Solo games are a great way to train
            your geographical knowledge when no other players are online.
          </div>
          <h5 className="howto second-title">See HOW FAR you can get</h5>
          <div>
            In the HOW FAR game mode, the goal is to advance as many fields as
            possible by making accurate guesses before the timer runs out. You
            can choose between a speed round of 3 minutes, a normal round of 10
            minutes, or a endurance round of 20 minutes.
          </div>
          <h5 className="howto second-title">See HOW FAST you can go</h5>
          <div>
            In the HOW FAST game mode, you choose a set gameboard size and try
            to finish as fast as possible.
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default HowToPlay;
