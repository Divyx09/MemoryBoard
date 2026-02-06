import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import ShapeSelector from './components/ShapeSelector';

// Define pastel color palette
const COLORS = [
  '#fef08a', // bright yellow
  '#fecaca', // soft pink
  '#bfdbfe', // light blue
  '#bbf7d0', // mint green
  '#fbcfe8', // pink
  '#fed7aa', // peach
  '#ddd6fe', // lavender
  '#c7d2fe', // periwinkle
];

// Get random rotation between -4 and +4 degrees
const getRandomRotation = () => {
  return Math.floor(Math.random() * 9) - 4; // -4 to +4
};

function App() {
  const [notes, setNotes] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [selectedShape, setSelectedShape] = useState('rectangle');

  useEffect(() => {
    // Initialize socket connection
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    const newSocket = io(SERVER_URL);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('notes', (receivedNotes) => {
      console.log('📥 Received notes update:', receivedNotes.length);
      setNotes(receivedNotes);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    // Fetch initial notes from REST API
    fetch(`${SERVER_URL}/notes`)
      .then((res) => res.json())
      .then((data) => {
        console.log('📥 Fetched initial notes:', data?.length || 0);
        if (Array.isArray(data)) {
          setNotes(data);
        }
      })
      .catch((err) => console.error('Error fetching notes:', err));

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateNote = ({ content, x, y, shape }) => {
    if (!socket) return;

    const noteData = {
      content,
      x,
      y,
      shape: shape || 'rectangle',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: getRandomRotation(),
    };

    console.log('📤 Creating note:', noteData);
    socket.emit('createNote', noteData);
  };

  const handleDragStop = (id, x, y) => {
    if (!socket) return;

    console.log('📤 Updating note position:', { id, x, y });
    socket.emit('updateNotePosition', { id, x, y });
  };

  return (
    <div className="app">
      {/* Background texture */}
      <div className="background-texture" />

      {/* Header */}
      <header className="header">
        <h1 className="app-title">SAIT-2k26 Memory Board</h1>
        <div className="connection-status">
          <span
            className={`status-dot ${connectionStatus === 'connected' ? 'connected' : ''}`}
          />
          <span className="status-text">{connectionStatus}</span>
        </div>
      </header>

      {/* Note counter */}
      <div className="note-counter">
        <div className="counter-number">{notes.length}</div>
        <div className="counter-label">memories</div>
      </div>

      {/* Shape Selector */}
      <ShapeSelector 
        selectedShape={selectedShape} 
        onShapeChange={setSelectedShape} 
      />

      {/* Note input */}
      <NoteInput 
        onCreateNote={handleCreateNote}
        selectedShape={selectedShape}
        onShapeChange={setSelectedShape}
      />

      {/* Board with notes */}
      <div className="board">
        {notes.map((note) => (
          <Note key={note._id} note={note} onDragStop={handleDragStop} />
        ))}
      </div>
    </div>
  );
}

export default App;
