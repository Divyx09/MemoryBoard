import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Note from './models/Note.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

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

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Divyx09:4235deep@memoryboard.iglq4sg.mongodb.net/?appName=memoryBoard';
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

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Handle creating a new note
  socket.on('createNote', async (noteData) => {
    try {
      console.log('📝 Creating note:', noteData);
      
      // Find the highest zIndex
      const highestNote = await Note.findOne().sort({ zIndex: -1 });
      const newZIndex = highestNote ? highestNote.zIndex + 1 : 1;

      // Create and save the note
      const note = new Note({
        ...noteData,
        zIndex: newZIndex,
      });
      await note.save();

      // Broadcast all notes to all clients
      const allNotes = await Note.find().sort({ createdAt: 1 });
      io.emit('notes', allNotes);
      
      console.log('✅ Note created successfully');
    } catch (error) {
      console.error('❌ Error creating note:', error);
      socket.emit('error', { message: 'Failed to create note' });
    }
  });

  // Handle updating note position
  socket.on('updateNotePosition', async ({ id, x, y }) => {
    try {
      console.log('📍 Updating note position:', { id, x, y });
      
      // Find the highest zIndex to bring this note to front
      const highestNote = await Note.findOne().sort({ zIndex: -1 });
      const newZIndex = highestNote ? highestNote.zIndex + 1 : 1;

      // Update note position and bring to front
      await Note.findByIdAndUpdate(id, {
        x,
        y,
        zIndex: newZIndex,
      });

      // Broadcast all notes to all clients
      const allNotes = await Note.find().sort({ createdAt: 1 });
      io.emit('notes', allNotes);
      
      console.log('✅ Note position updated successfully');
    } catch (error) {
      console.error('❌ Error updating note position:', error);
      socket.emit('error', { message: 'Failed to update note position' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io listening for connections`);
});
