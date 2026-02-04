import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const Note = ({ note, onDragStop }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: note.x, y: note.y }}
      onStop={(e, data) => onDragStop(note._id, data.x, data.y)}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="note"
        style={{
          backgroundColor: note.color,
          transform: `rotate(${note.rotation}deg)`,
          zIndex: note.zIndex,
        }}
      >
        <div className="note-content">{note.content}</div>
      </div>
    </Draggable>
  );
};

export default Note;
