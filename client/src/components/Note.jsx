import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const Note = ({ note, onDragStop, onUpdateNote, localCreatorId }) => {
  const nodeRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedName, setEditedName] = useState(note.name || '');

  // Determine if this user is allowed to edit/drag the note.
  // We allow editing if:
  // 1. The note has no creatorId (legacy note / backward compatibility)
  // 2. The note's creatorId matches the client's localCreatorId
  // 3. The client's localCreatorId is the admin/superuser bypass ID 'deep2004'
  const isCreator = !note.creatorId || note.creatorId === localCreatorId || localCreatorId === 'deep2004';

  // Track window size dynamically for responsive positioning calculations
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize internal state with note prop changes
  useEffect(() => {
    setEditedContent(note.content);
    setEditedName(note.name || '');
  }, [note.content, note.name]);

  // Helper to translate solid hex color to translucent glassmorphic rgba color
  const hexToRGBA = (hex, alpha) => {
    if (!hex || hex[0] !== '#') return hex;
    let cleanHex = hex.slice(1);
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Define note sizes per shape to prevent boundary clipping
  const getNoteDimensions = (shape) => {
    const isMobile = windowSize.width < 640;
    switch (shape) {
      case 'rectangle':
        return isMobile ? { w: 160, h: 120 } : { w: 230, h: 160 };
      case 'square':
        return isMobile ? { w: 130, h: 130 } : { w: 180, h: 180 };
      case 'pentagon':
        return isMobile ? { w: 140, h: 140 } : { w: 200, h: 200 };
      case 'oval':
        return isMobile ? { w: 160, h: 120 } : { w: 230, h: 160 };
      default:
        return isMobile ? { w: 160, h: 120 } : { w: 230, h: 160 };
    }
  };

  const { w: noteWidth, h: noteHeight } = getNoteDimensions(note.shape);

  // Convert stored percentage (0-100) back to actual pixel coordinate on render
  const getPixelCoords = () => {
    let xPercent = note.x;
    let yPercent = note.y;

    // Backward compatibility: if coordinates are absolute pixels (historical),
    // convert them to relative percentage coordinates (assumed base 1400x800 desktop)
    if (note.x > 100) {
      xPercent = (note.x / 1400) * 100;
    }
    if (note.y > 100) {
      yPercent = (note.y / 800) * 100;
    }

    // Keep coordinates constrained between 0% and 100%
    xPercent = Math.max(0, Math.min(100, xPercent));
    yPercent = Math.max(0, Math.min(100, yPercent));

    // Translate percentages to current pixel space, keeping notes within board boundary
    const xPx = Math.max(0, Math.min(windowSize.width - noteWidth, (xPercent / 100) * windowSize.width));
    const yPx = Math.max(0, Math.min(windowSize.height - noteHeight, (yPercent / 100) * windowSize.height));

    return { x: xPx, y: yPx };
  };

  const pixelCoords = getPixelCoords();

  const handleDragStopInternal = (e, data) => {
    // Translate the final absolute drag pixels back to 0-100 percentage values
    const xPercent = (data.x / windowSize.width) * 100;
    const yPercent = (data.y / windowSize.height) * 100;
    onDragStop(note._id, xPercent, yPercent);
  };

  const handleSave = () => {
    if (!editedContent.trim()) return;
    onUpdateNote(note._id, {
      content: editedContent.trim(),
      name: editedName.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setEditedName(note.name || '');
    setIsEditing(false);
  };

  // SVGs for modern crisp buttons instead of emojis
  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );

  const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-icon">
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </svg>
  );

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pixelCoords}
      onStop={handleDragStopInternal}
      bounds="parent"
      cancel="input,textarea,button,.svg-icon" // Prevent dragging while interacting with edit fields or icons
    >
      <div
        ref={nodeRef}
        className="note-container"
        style={{
          zIndex: note.zIndex,
          cursor: 'grab',
        }}
      >
        <div
          className={`note note-${note.shape || 'rectangle'} ${isEditing ? 'editing' : ''}`}
          style={{
            backgroundColor: hexToRGBA(note.color, 0.80),
            transform: `rotate(${note.rotation || 0}deg)`,
          }}
        >
          {isEditing ? (
            <>
              <textarea
                className="note-content-input"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                maxLength={500}
                placeholder="Write your note..."
              />
              <input
                type="text"
                className="note-name-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                maxLength={50}
                placeholder="Your name..."
              />
              <div className="note-edit-actions">
                <button
                  type="button"
                  className="edit-action-btn save-btn"
                  onClick={handleSave}
                  disabled={!editedContent.trim()}
                  title="Save changes"
                >
                  <SaveIcon />
                </button>
                <button
                  type="button"
                  className="edit-action-btn cancel-btn"
                  onClick={handleCancel}
                  title="Cancel changes"
                >
                  <CancelIcon />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="note-content">{note.content}</div>
              {note.name && (
                <div className="note-author">
                  ~ {note.name}
                </div>
              )}
              {isCreator && (
                <button
                  type="button"
                  className="note-edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit Note"
                >
                  <EditIcon />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Note;
