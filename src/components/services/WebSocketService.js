import Stomper from "../../helpers/Stomp";

let webSocket = null;

const WebSocketService = () => {
  webSocket = Stomper.getInstance();
  webSocket.connect().then(() => {
    webSocket.join("/topic/users", function (payload) {
      console.log(JSON.parse(payload.body).content);
    });
  });
};

export default WebSocketService;
