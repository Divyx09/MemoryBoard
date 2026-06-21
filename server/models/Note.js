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
      enum: ['rectangle', 'square', 'circle', 'oval', 'pentagon', 'star', 'heart', 'hexagon', 'triangle'],
      default: 'rectangle',
    },
    name: {
      type: String,
      default: '',
      maxlength: 50,
    },
    creatorId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Note', noteSchema);
