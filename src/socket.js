import { io } from 'socket.io-client';

// Configure socket
const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false,       // Connect only after login
});

export default socket;
