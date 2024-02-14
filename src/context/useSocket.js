import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export const useSocket = (url) => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return socket[url];
};

export const SocketProvider = ({ urls, children }) => {
  const [sockets, setSockets] = useState({});

  useEffect(() => {
    const newSockets = {};
    urls.forEach((url) => {
      if (!sockets[url]) {
        newSockets[url] = new WebSocket(url);
      }
    });
    setSockets((prevSockets) => ({ ...prevSockets, ...newSockets }));

    return () => {
      Object.values(sockets).forEach((socket) => {
        socket.close();
      });
    };
  }, [sockets, urls]);

  return (
    <SocketContext.Provider value={sockets}>
      {children}
    </SocketContext.Provider>
  );
};
