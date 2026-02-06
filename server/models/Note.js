import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    zIndex: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '#fef3c7',
    },
    rotation: {
      type: Number,
      default: 0,
    },
    shape: {
      type: String,
      enum: ['rectangle', 'square', 'circle', 'oval', 'star', 'heart', 'hexagon', 'triangle'],
      default: 'rectangle',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Note', noteSchema);
