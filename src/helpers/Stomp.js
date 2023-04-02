import {handleError} from 'helpers/api';

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getWS } from "./getDomain";

class Stomper {
    socket;
    stompClient;
    openChannels = [];

    constructor(channel) {
        this.listeners = [];
        this.connect()
        this.join(channel)
    }

    join(channel) {
        this.openChannels.push(channel);
    }
    leave(channel) {
        this.openChannels = this.openChannels.filter((l) => l !== channel);
    }

    async connect() {
            try {
            this.socket.close();
        } catch {
        }

        this.socket = new SockJS(getWS());

        this.stompClient = Stomp.over(this.socket);
        this.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            this.stompClient.subscribe("/topic/users", function (greeting) {
                console.log(JSON.parse(greeting.body).content);
            });
        });

        this.socket.onclose = () => {
            this._handleDisconnect("Socket closed.");
        };
        this.socket.onerror = (e) => this._handleError(e);
    }

    disconnect = (reason) => {
        try {
            this.stompClient.disconnect(() => {
                this._handleDisconnect(reason);
            }, {});
        } catch {
        }
    }

    _handleDisconnect = (reason) => {
        console.log(reason);
    }
    _handleError = (error) => {
        console.log(handleError(error));
    }
}

export default Stomper;