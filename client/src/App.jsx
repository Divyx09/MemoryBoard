import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import NoteInput from './components/NoteInput';
import ShapeSelector from './components/ShapeSelector';
import backgroundVideo from './assets/VN20260614_203904~2.mp4';

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

// Retrieve or generate a unique creatorId for this client
const getOrCreateCreatorId = () => {
  let id = localStorage.getItem('memory_board_creator_id');
  if (!id) {
    id = 'usr_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('memory_board_creator_id', id);
  }
  return id;
};

const creatorId = getOrCreateCreatorId();

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

  // Fetch all notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/notes`);
      const data = await response.json();
      console.log('📥 Fetched notes:', data?.length || 0);
      if (Array.isArray(data)) {
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async ({ content, name, x, y, shape }) => {
    const noteData = {
      content,
      name: name || '',
      x,
      y,
      shape: shape || 'rectangle',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: getRandomRotation(),
      creatorId,
    };

    try {
      console.log('📤 Creating note:', noteData);
      const response = await fetch(`${SERVER_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        console.log('✅ Note created successfully');
      } else {
        console.error('Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDragStop = async (id, x, y) => {
    try {
      console.log('📤 Updating note position:', { id, x, y });
      const response = await fetch(`${SERVER_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x, y, creatorId }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        // Update the note in state
        setNotes(notes.map(note => note._id === id ? updatedNote : note));
        console.log('✅ Note position updated successfully');
      }
    } catch (error) {
      console.error('Error updating note position:', error);
    }
  };

  const handleUpdateNote = async (id, { content, name }) => {
    try {
      console.log('📤 Updating note content/name:', { id, content, name });
      const response = await fetch(`${SERVER_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, name, creatorId }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(note => note._id === id ? updatedNote : note));
        console.log('✅ Note content/name updated successfully');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="app">
      {/* Background Video Container */}
      <div className="background-video-container">
        <video 
          className="background-video rotate-270"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Translucent overlay to darken/soften the video for note legibility */}
        <div className="video-overlay" />
      </div>

      {/* Header */}
      <header className="header">
        <h1 className="app-title">SAIT-2k26 Memory Board</h1>
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
          <Note 
            key={note._id} 
            note={note} 
            onDragStop={handleDragStop} 
            onUpdateNote={handleUpdateNote} 
            localCreatorId={creatorId}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
