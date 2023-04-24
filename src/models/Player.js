/**
 * Player model
 */
class Player {
  constructor(data = {}) {
    this.id = null;
    this.userToken = null;
    this.gameId = null;
    this.playerName = null;
    this.token = null;
    this.playerColor = null;
    this.isHost = null;
    Object.assign(this, data);
  }
}
export default Player;
