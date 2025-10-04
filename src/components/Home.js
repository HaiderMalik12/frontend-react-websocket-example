import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationListener from '../components/NotificationListener';
import VideoCall from '../components/VideoCall';
import PricingPage from './PricingPage';

function Home() {
  // Simulate logged-in user
  const [user, setUser] = useState(null);

  // Simulated login
  const handleLogin = () => {
    const fakeUser = { id: prompt('Enter the user ID'), name: 'Name User' };
    setUser(fakeUser);
  };

  useEffect(() => {
    if (user) {
      // Connect to socket after login
      socket.connect();
      socket.emit('register', { userId: user.id});

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
      <VideoCall user={user} />
      <PricingPage teamId="47547d8c-72b2-4fb7-a872-e8680d24a6fb" />
    </div>
  );
}

export default Home;
