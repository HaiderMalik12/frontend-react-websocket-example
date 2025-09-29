import React, { useState, useEffect } from 'react';
import socket from './socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationListener from './components/NotificationListener';

function App() {
  // Simulate logged-in user
  const [user, setUser] = useState(null);

  // Simulated login
  const handleLogin = () => {
    const fakeUser = { id: '929c1838-dbab-4344-9446-1bf391a60d90', name: 'Haider' };
    setUser(fakeUser);
  };

  useEffect(() => {
    if (user) {
      // Connect to socket after login
      socket.connect();
      socket.emit('register', user.id);

      console.log('User connected to socket:', user.id);

      return () => {
        socket.disconnect(); // Disconnect on logout/unmount
      };
    }
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Real-Time Notifications Demo</h1>

      {!user ? (
        <button onClick={handleLogin}>Login as User</button>
      ) : (
        <p>Logged in as <strong>{user.name}</strong></p>
      )}

      <NotificationListener/>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

export default App;
