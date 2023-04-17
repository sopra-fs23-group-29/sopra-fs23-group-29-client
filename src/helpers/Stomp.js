import { handleError } from "helpers/api";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getWS } from "./getDomain";

class Stomper {
  static instance = null;

  static async getInstance() {
    if (!Stomper.instance) {
      Stomper.instance = new Stomper();
      Stomper.instance.connect().then(() => {
        return Stomper.instance;
      });
    }
    return Stomper.instance;
  }

  // static async getInstanceFirst() {
  //   Stomper.instance = new Stomper();
  //   Stomper.instance.connect().then(() => {
  //     return Stomper.instance;
  //   });
  // }

  socket;
  stompClient;
  openChannels = [];

  constructor() {
    this.listeners = [];
  }

  join(endpoint, callback) {
    if (this.openChannels.indexOf(endpoint) === -1) {
      console.log(endpoint);
      console.log(this.openChannels);
      this.openChannels.push(endpoint);
      console.log(endpoint);
      console.log(this.openChannels);
      this.stompClient.subscribe(endpoint, callback);
      console.log("Subscribed to " + endpoint);
    }
  }

  send(destination, message) {
    this.stompClient.send(destination, {}, JSON.stringify(message));
    console.log("Sent message " + message + " to " + destination);
  }

  leave(endpoint) {
    let index = this.openChannels.indexOf(endpoint);
    if (index !== -1) {
      this.stompClient.unsubscribe(endpoint);
      this.openChannels.splice(index, 1);
      console.log("Unsubscribed from " + endpoint);
    }
  }

  leaveAll() {
    this.openChannels.forEach((endpoint) => {
      this.stompClient.unsubscribe(endpoint);
      console.log("Unsubscribed from " + endpoint);
    });
    this.openChannels = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket.close();
      } catch (e) {}

      this.socket = new SockJS(getWS());
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        (frame) => {
          console.log("Connected: " + frame);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );

      this.socket.onclose = () => {
        this._handleDisconnect("Socket closed.");
      };
      this.socket.onerror = (e) => this._handleError(e);
    });
  }

  disconnect = (reason) => {
    try {
      this.stompClient.disconnect(() => {
        this._handleDisconnect(reason);
      }, {});
    } catch {}
  };

  _handleDisconnect = (reason) => {
    console.log(reason);
  };

  _handleError = (error) => {
    console.log(handleError(error));
  };
}

export default Stomper;
