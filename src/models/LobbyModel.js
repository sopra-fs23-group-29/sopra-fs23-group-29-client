/**
 * Lobby model
 */
class LobbyModel {
  constructor(data = {}) {
    this.id = null;
    this.mode = null;
    this.name = null;
    this.players = null;
    Object.assign(this, data);
  }
}
export default LobbyModel;
