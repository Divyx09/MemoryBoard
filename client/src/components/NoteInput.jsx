import React, { useState, useRef, useEffect } from 'react';

const NoteInput = ({ onCreateNote, selectedShape, onShapeChange }) => {
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
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

    // Calculate random percentage coordinates near center (35% to 65%)
    const randomX = 50 + (Math.random() - 0.5) * 30;
    const randomY = 50 + (Math.random() - 0.5) * 25;

    // Call the callback with the note data
    onCreateNote({
      content: content.trim(),
      name: name.trim(),
      x: randomX,
      y: randomY,
      shape: selectedShape,
    });

    // Clear content input and refocus, but keep the name for consecutive drops
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
      <form className="note-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="name-input"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
        <div className="input-divider" />
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
