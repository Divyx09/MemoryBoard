import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Note from './models/Note.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// REST API Endpoints

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: 1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create a new note
app.post('/notes', async (req, res) => {
  try {
    console.log('📝 Creating note:', req.body);
    
    // Find the highest zIndex
    const highestNote = await Note.findOne().sort({ zIndex: -1 });
    const newZIndex = highestNote ? highestNote.zIndex + 1 : 1;

    // Create and save the note
    const note = new Note({
      ...req.body,
      zIndex: newZIndex,
    });
    await note.save();
    
    console.log('✅ Note created successfully');
    res.status(201).json(note);
  } catch (error) {
    console.error('❌ Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note position, content, or name (and bring to front)
app.put('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y, content, name } = req.body;
    
    console.log('📍 Updating note:', { id, x, y, content, name });
    
    // Find the highest zIndex to bring this note to front
    const highestNote = await Note.findOne().sort({ zIndex: -1 });
    const newZIndex = highestNote ? highestNote.zIndex + 1 : 1;

    // Build the dynamic update object
    const updateData = { zIndex: newZIndex };
    if (x !== undefined) updateData.x = x;
    if (y !== undefined) updateData.y = y;
    if (content !== undefined) updateData.content = content;
    if (name !== undefined) updateData.name = name;

    // Update note and bring to front
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    console.log('✅ Note position updated successfully');
    res.json(updatedNote);
  } catch (error) {
    console.error('❌ Error updating note position:', error);
    res.status(500).json({ error: 'Failed to update note position' });
  }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    console.log('✅ Note deleted successfully');
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 REST API ready at http://localhost:${PORT}`);
});
