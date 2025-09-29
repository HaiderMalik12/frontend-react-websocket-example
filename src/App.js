import { useEffect } from "react";
import socket from "./socket";
import NotificationListener from "./components/NotificationListener";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react"; 


function App() {

  const [user, setUser] = useState(null);

  const handleLogin = () => {   

   const fakeUser = {
    id: '929c1838-dbab-4344-9446-1bf391a60d90',
    name: 'John Doe'
   } 
   setUser(fakeUser); 
  }

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('register', { userId: user.id });
      
      console.log('Socket connected and user registered', user.id);
    }

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    }

  },[user])

  return (
     <div style={{ padding: '20px' }}>
    <h1> Websocket Demo</h1>
    {!user ? (
      <button onClick={handleLogin}>Login</button>
    ) : (
      <div>
        <p>Welcome, {user.name}</p>
        <p>Your user ID: {user.id}</p>
      </div>
    )}
    <NotificationListener />
    <ToastContainer position="top-right" autoClose={5000}  /> 
     </div>
  );
}

export default App;
