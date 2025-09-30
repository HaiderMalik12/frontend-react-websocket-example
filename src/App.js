import VideoCall from './components/VideoCall';
import NotificationListener from './components/NotificationListener';
import { useEffect, useState } from 'react';
import socket from './socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    const fakeUser = {
      id: prompt('Enter your user ID (e.g. user1, user2)'),
      name: 'Demo User'
    };
    setUser(fakeUser);
  };

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('register', { userId: user.id });
      console.log('Registered as', user.id);
    }
    return () => socket.disconnect();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h1>WebRTC Video Call Demo</h1>
      {!user ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <div>
          <p>Welcome {user.name} (ID: {user.id})</p>
          <NotificationListener />
          <ToastContainer position="top-right" autoClose={5000}  /> 
          <VideoCall user={user} />
        </div>
      )}
    </div>
  );
}

export default App;