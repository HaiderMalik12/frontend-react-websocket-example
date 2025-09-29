import { useEffect } from 'react';
import { toast } from 'react-toastify';
import socket from '../socket';

function NotificationListener() {
  useEffect(() => {
    // Listen for notification event
    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      toast.info(`${data.message} (${new Date(data.timestamp).toLocaleTimeString()})`);
    });

    // Cleanup listener
    return () => {
      socket.off('notification');
    };
  }, []);

  return null; // This component does not render anything
}

export default NotificationListener;
