import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';

const VideoCall = ({ user }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Handle incoming call
    socket.on('incoming-call', async ({ from, offer }) => {
      console.log('Incoming call from', from);

      await setupLocalStream();

      peerConnectionRef.current = createPeerConnection(from);

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit('answer-call', { targetUserId: from, answer });
      setInCall(true);
    });

    // Handle call answered
    socket.on('call-answered', async ({ from, answer }) => {
      console.log('Call answered by', from);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      setInCall(true);
    });

    // Handle ICE candidates
    socket.on('ice-candidate', async ({ from, candidate }) => {
      console.log('Received ICE candidate from', from);
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ICE candidate', err);
      }
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-answered');
      socket.off('ice-candidate');
    };
  }, [user]);

  // Setup local stream
  const setupLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    return stream;
  };

  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // for NAT traversal
    });

    // Add local tracks
    localVideoRef.current.srcObject.getTracks().forEach(track =>
      pc.addTrack(track, localVideoRef.current.srcObject)
    );

    // Remote stream
    pc.ontrack = (event) => {
      console.log('Remote stream added');
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { targetUserId: remoteUserId, candidate: event.candidate });
      }
    };

    return pc;
  };

  // Start a call (caller)
  const startCall = async () => {
    if (!targetUserId) return alert('Enter target user ID');

    await setupLocalStream();

    peerConnectionRef.current = createPeerConnection(targetUserId);

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit('call-user', { targetUserId, offer });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Video Call</h2>
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: 300, border: '1px solid black' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: 300, border: '1px solid black', marginLeft: '10px' }} />
      </div>

      {!inCall && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Enter target user ID"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
          />
          <button onClick={startCall}>Start Call</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
