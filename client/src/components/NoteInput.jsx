import React, { useState, useRef, useEffect } from 'react';
import ShapeSelector from './ShapeSelector';

const NoteInput = ({ onCreateNote }) => {
  const [content, setContent] = useState('');
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim()) {
      return;
    }

    // Calculate random position near center
    const centerX = window.innerWidth / 2 - 110; // 110 is half of note width
    const centerY = window.innerHeight / 2 - 90; // 90 is half of note height
    const randomX = centerX + (Math.random() - 0.5) * 300;
    const randomY = centerY + (Math.random() - 0.5) * 200;

    // Call the callback with the note data
    onCreateNote({
      content: content.trim(),
      x: randomX,
      y: randomY,
      shape: selectedShape,
    });

    // Clear input and refocus
    setContent('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="note-input-container">
      <ShapeSelector 
        selectedShape={selectedShape} 
        onShapeChange={setSelectedShape} 
      />
      <form className="note-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="note-input"
          placeholder="Drop a memory, thought, joke, quote, secret, reminder, wish..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button
          type="submit"
          className="drop-button"
          disabled={!content.trim()}
        >
          Drop
        </button>
      </form>
    </div>
  );
};

export default NoteInput;
