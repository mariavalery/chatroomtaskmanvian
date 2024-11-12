import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); 

function App() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(''); 
  useEffect(() => {
 
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message'); 
    };
  }, []);

  const handleJoin = () => {
    if (name && room) {
      socket.emit('joinRoom', name, room);
    }
  };
  const handleSendMessage = () => {
    if (message) {
      socket.emit('chatMessage', { name, room, message }); 
      setMessages((prevMessages) => [...prevMessages, `${name}: ${message}`]); 
      setMessage(''); 
    }
  };
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="flex gap-4 justify-center items-start py-3">
        <div className="w-full flex gap-2">
          <input
            className="w-full h-10 bg-white rounded-md px-2 text-black"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full h-10 bg-white rounded-md px-2 text-black"
            type="text"
            placeholder="Chat Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <button onClick={handleJoin} className="w-20 h-10 bg-white rounded-md text-black">
          Join
        </button>
      </div>

      <div className="bg-gray-800 flex flex-col flex-1 h-80 rounded-md m-8 p-4 overflow-auto">
      <input
          className="w-full h-10 bg-white rounded-md px-2 mt-2"
          type="text"
          placeholder="Welcome to the Chat Room"
        />
        <div >
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        </div>
      </div>
      <h1 className='p-3'>Active Rooms:</h1>
      <h1 className='p-3'>Users in Manvian:</h1>
      <div className='w-full px-3'>
      <input
            className="w-3/4 h-10 bg-white rounded-md px-2 text-black mx-3"
            type="text"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
      <button className=' rounded-md bg-white text-black w-40 h-10'onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
