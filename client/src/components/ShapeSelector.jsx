import React from 'react';

const ShapeSelector = ({ selectedShape, onShapeChange }) => {
  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'square', name: 'Square', icon: '◻' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'oval', name: 'Oval', icon: '⬭' },
    { id: 'star', name: 'Star', icon: '★' },
    { id: 'heart', name: 'Heart', icon: '♥' },
    { id: 'hexagon', name: 'Hexagon', icon: '⬡' },
    { id: 'triangle', name: 'Triangle', icon: '△' },
  ];

  return (
    <div className="shape-selector">
      <label className="shape-selector-label">Note Shape:</label>
      <div className="shape-options">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            className={`shape-option ${selectedShape === shape.id ? 'active' : ''}`}
            onClick={() => onShapeChange(shape.id)}
            title={shape.name}
            type="button"
          >
            <span className="shape-icon">{shape.icon}</span>
            <span className="shape-name">{shape.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapeSelector;
