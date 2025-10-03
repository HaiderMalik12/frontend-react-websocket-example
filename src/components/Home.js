import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationListener from './NotificationListener';
import VideoCall from './VideoCall';
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
      <PricingPage teamId="707aabe9-4a09-4d4f-9772-2b4143f3637a"/>
      
    </div>
  );
}

export default Home;
