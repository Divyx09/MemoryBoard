# 📌 SAIT-2k26 Memory Board

A modern, real-time digital notice board where anyone can drop short notes, thoughts, and memories. Built with React, Node.js, Socket.io, and MongoDB.

![Memory Board](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 📝 **Create Notes**: Drop thoughts, jokes, quotes, reminders, or memories
- 🖱️ **Drag & Drop**: Move notes freely around the board
- 🎨 **Colorful Design**: Random pastel colors for each note
- 🔄 **Real-time Sync**: Updates instantly across all connected users
- 💾 **Persistent Storage**: Notes saved to MongoDB
- 🛡️ **Rate Limiting**: Protection against abuse with request rate limiting
- 📊 **Live Counter**: Shows total number of memories in real-time
- 🎯 **Z-Index Management**: Recently moved notes appear on top
- 📱 **Responsive**: Works on desktop, tablets, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI framework with hooks
- **Vite** - Lightning-fast build tool
- **Socket.io Client** - Real-time communication
- **react-draggable** - Drag and drop functionality
- **nanoid** - Unique ID generation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket communication
- **express-rate-limit** - Rate limiting middleware
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Divyx09/MemoryBoard.git
cd MemoryBoard
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `server` directory:
```bash
cd ../server
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/memoryboard
CLIENT_URL=http://localhost:5173
PORT=3001
```

Create a `.env` file in the `client` directory:
```bash
cd ../client
cp .env.example .env
```

Edit `.env`:
```env
VITE_SERVER_URL=http://localhost:3001
```

### Running the Application

1. **Start MongoDB**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# On Windows
net start MongoDB
```

2. **Start the server** (from the `server` directory)
```bash
npm run dev
# or for production
npm start
```

The server will start on http://localhost:3001

3. **Start the client** (from the `client` directory, in a new terminal)
```bash
npm run dev
```

The client will start on http://localhost:5173

4. **Open your browser**

Navigate to http://localhost:5173 and start dropping memories! 🎉

## 📖 Usage Guide

### Creating a Note
1. Type your message in the input box at the bottom
2. Press **Enter** or click the **Drop** button
3. Your note appears on the board with a random color and slight rotation

### Moving Notes
1. Click and drag any note to reposition it
2. The position is automatically saved
3. All connected users see the update in real-time

### Viewing Live Updates
- Open multiple browser windows/tabs
- Create or move notes in one window
- Watch them update instantly in all windows
- The counter shows the total number of notes

## 📂 Project Structure

```
MemoryBoard/
├── server/
│   ├── models/
│   │   └── Note.js           # Mongoose schema for notes
│   ├── server.js             # Express & Socket.io server
│   ├── package.json          # Server dependencies
│   ├── .env.example          # Environment variables template
│   └── .gitignore
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Note.jsx      # Individual note component
│   │   │   └── NoteInput.jsx # Input component for creating notes
│   │   ├── App.jsx           # Main application component
│   │   ├── App.css           # Application styles
│   │   └── main.jsx          # React entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Client dependencies
│   ├── .env.example          # Environment variables template
│   └── .gitignore
└── README.md                 # This file
```

## 🔌 API Reference

### REST Endpoints

#### GET /health
Health check endpoint
- **Response**: `{ status: 'ok', timestamp: '2024-01-01T00:00:00.000Z' }`

#### GET /notes
Retrieve all notes
- **Response**: Array of note objects
```json
[
  {
    "_id": "abc123",
    "content": "Hello, World!",
    "x": 100,
    "y": 200,
    "zIndex": 1,
    "color": "#fef3c7",
    "rotation": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Socket.io Events

#### Client → Server

**createNote**
```javascript
socket.emit('createNote', {
  content: 'Your note content',
  x: 100,
  y: 200,
  color: '#fef3c7',
  rotation: 2
});
```

**updateNotePosition**
```javascript
socket.emit('updateNotePosition', {
  id: 'note_id',
  x: 150,
  y: 250
});
```

#### Server → Client

**notes**
Broadcast when any note is created or updated
```javascript
socket.on('notes', (notes) => {
  // Receive all current notes
  console.log(notes);
});
```

**error**
Sent when an error occurs
```javascript
socket.on('error', (error) => {
  console.error(error.message);
});
```

## 🎨 Customization

### Changing Note Colors

Edit the `COLORS` array in `client/src/App.jsx`:
```javascript
const COLORS = [
  '#fef3c7', // yellow
  '#fecaca', // soft red
  '#bfdbfe', // light blue
  // Add your own colors...
];
```

### Adjusting Note Size

Modify the `.note` class in `client/src/App.css`:
```css
.note {
  width: 220px;      /* Change width */
  min-height: 180px; /* Change height */
  /* ... */
}
```

### Changing Rotation Range

Update the `getRandomRotation` function in `client/src/App.jsx`:
```javascript
const getRandomRotation = () => {
  return Math.floor(Math.random() * 9) - 4; // -4 to +4 degrees
};
```

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on your platform:
   - `MONGODB_URI` - Your MongoDB connection string (e.g., MongoDB Atlas)
   - `CLIENT_URL` - Your frontend URL
   - `PORT` - Will be set automatically by most platforms

2. Deploy the `server` directory

### Frontend Deployment (Vercel/Netlify)

1. Set environment variable:
   - `VITE_SERVER_URL` - Your backend URL

2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy the `client` directory

### MongoDB Atlas

For production, use MongoDB Atlas (free tier available):
1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `MONGODB_URI` in your server environment

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
sc query MongoDB
```

### Port Already in Use
```bash
# Kill process on port 3001 (server)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (client)
lsof -ti:5173 | xargs kill -9
```

### Socket.io Connection Failed
- Ensure the server is running
- Check `VITE_SERVER_URL` in client `.env`
- Verify CORS settings in `server/server.js`
- Check browser console for errors

### Notes Not Persisting
- Verify MongoDB is running
- Check `MONGODB_URI` in server `.env`
- Look for errors in server console
- Verify database connection in logs

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Future Ideas

- 🔍 Search and filter notes
- 🗑️ Delete notes functionality
- ✏️ Edit existing notes
- 👤 User authentication and profiles
- 🏷️ Tags and categories
- 🔒 Private boards with access control
- 📸 Image attachments
- 🌙 Dark mode
- 📤 Export notes as PDF/JSON
- 🔔 Notifications for new notes

## 👨‍💻 Author

Created with ❤️ by the Memory Board Team

## 🙏 Acknowledgments

- Google Fonts for Caveat and Inter fonts
- The React and Node.js communities
- Socket.io for real-time magic
- MongoDB for reliable data storage

---

**Happy note dropping! 🎉**
