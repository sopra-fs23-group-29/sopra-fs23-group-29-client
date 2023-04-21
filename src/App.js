import React, { useState, useEffect } from 'react';
import AppRouter from 'components/routing/routers/AppRouter';
import Stomper from 'helpers/Stomp';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = sessionStorage.getItem('token');
      if (token !== null) {
        const webSocket = Stomper.getInstance();
        webSocket.emptyChannelsList();
        sessionStorage.setItem('subscribedEndpoints', JSON.stringify(webSocket.openChannels));
        await webSocket.connect();
        setIsConnected(true);
      } else {
        setIsConnected(true);
      }
    };
    checkToken();
  }, []);

  return (
    <div>
      {isConnected && (
        <AppRouter />
      )}
    </div>
  );
};

export default App;

