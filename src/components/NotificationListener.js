import { useEffect } from "react";
import socket from "../socket";
import { toast } from "react-toastify";

const NotificationListener = () => {
  useEffect(() => {

    socket.on('notification', (data) => {
      toast.info(`New notification: ${data.message}`);
    });

    return () => {
      socket.off('notification');
    };
    
  }, []);

  return null;

}

export default NotificationListener;