import React,  {useState, useEffect, useRef } from 'react';
import socket from '../socket';

const VideoCall = ({user}) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [targetUserId, setTargetUserId] = useState('');
    const [inCall, setInCall] = useState(false);


    useEffect(() => {

        if (!user) return;

        //Handle the incoming call
        socket.on('incoming-call', async ({from, offer}) => {
            console.log('Incoming call from:', from);

            await setupLocalStream();

            peerConnectionRef.current = createPeerConnection(from);

            await  peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket.emit('answer-call', { targetUserId: from, answer });

            setInCall(true);
        });

        socket.on('call-answered', async ({ answer, from }) => {
            console.log('Call answered by', from);
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            setInCall(true);
        });

        socket.on('ice-candidate', async ({ candidate, from}) => {

            console.log('Received ICE candidate from', from);
            try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        return () => {
            socket.off('incoming-call');
            socket.off('call-answered');
            socket.off('ice-candidate');
        };

    },[user])


    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;
            console.log('Local stream set up');
            return stream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    const createPeerConnection = (remoteUserId) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' } // FOR NAT TRAVERSAL
            ]
        });

        // Add local tracks
        localVideoRef.current.srcObject.getTracks().forEach(track => {
            pc.addTrack(track, localVideoRef.current.srcObject);
        });

        // Remote stream

        pc.ontrack = (event) => {
            console.log('Remote track received');
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        // ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { targetUserId: remoteUserId, candidate: event.candidate });
            }
        };

        return pc;
    }

    const startCall = async () => {
        if (!targetUserId) {
            alert('Please enter a target user ID');
            return;
        }

        await setupLocalStream();
        peerConnectionRef.current = createPeerConnection(targetUserId);

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socket.emit('call-user', { targetUserId, offer });

        console.log('Call started to', targetUserId);
    }

    return(
        <div style={{marginTop: '20px'}}>
            <h3>Video Call</h3>
            <div>
            <video ref={localVideoRef} autoPlay muted style={{width:300, border: '1px solid black'}}/>
            <video ref={remoteVideoRef} autoPlay muted style={{width:300, border: '1px solid black', marginLeft:'10px'}}/>
            </div>

            {!inCall && (
            <div style={{marginTop: '10px'}}>
                <input
                    type="text"
                    placeholder="Enter Target User ID"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                />
                <button onClick={startCall}> Start Call</button>
            </div>
            )}
        </div>
    )

}


export default VideoCall;