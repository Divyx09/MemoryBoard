# Testing Guide for Memory Board

## Prerequisites Verification
- ✅ Node.js installed (v16+)
- ✅ MongoDB installed and running
- ✅ Server dependencies installed (`npm install` in server/)
- ✅ Client dependencies installed (`npm install` in client/)

## Test Scenarios

### 1. Basic Functionality Tests

#### Server Health Check
```bash
# Start server
cd server && npm start

# In another terminal, test health endpoint
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

#### Client Build Test
```bash
cd client && npm run build
# Expected: Successful build with no errors
```

### 2. Real-time Functionality Tests

#### Test 1: Create Notes
1. Open browser to http://localhost:5173
2. Type a message in the input box
3. Press Enter or click "Drop" button
4. Verify note appears on board with:
   - Random pastel color
   - Slight rotation (-4 to +4 degrees)
   - Counter increments

#### Test 2: Drag Notes
1. Click and drag any note
2. Release in new position
3. Verify note stays in new position
4. Refresh browser - note should remain at new position

#### Test 3: Multi-Window Sync
1. Open Memory Board in two browser windows/tabs
2. Create note in window 1
3. Verify note appears immediately in window 2
4. Drag note in window 2
5. Verify position updates in window 1
6. Verify counter updates in both windows

#### Test 4: Z-Index Management
1. Create multiple notes
2. Drag an older note
3. Verify it appears on top of other notes
4. Create new note
5. Verify new note appears on top

#### Test 5: Connection Status
1. Stop the server
2. Verify connection status changes to "disconnected"
3. Start server again
4. Verify connection status changes to "connected"

### 3. Edge Case Tests

#### Empty Note Prevention
1. Try to submit empty note
2. Verify "Drop" button is disabled
3. Verify no note is created

#### Long Content
1. Type ~500 characters
2. Verify note is created successfully
3. Verify text wraps properly in note

#### Rapid Creation
1. Quickly create 10 notes
2. Verify all notes appear
3. Verify counter is accurate
4. Verify all notes persist after refresh

### 4. Responsive Design Tests

#### Desktop (1920x1080)
- Verify layout looks good
- Verify notes are draggable
- Verify all text is readable

#### Tablet (768x1024)
- Verify notes are smaller but readable
- Verify drag functionality works
- Verify input box is accessible

#### Mobile (375x667)
- Verify notes stack properly
- Verify input is accessible at bottom
- Verify counter is visible

## Known Limitations

1. **No Authentication**: Anyone can add/move notes
2. **No Delete Function**: Notes cannot be removed (by design)
3. **No Edit Function**: Notes cannot be edited after creation
4. **Overlap**: Notes can overlap (intentional feature)

## Success Criteria

- ✅ All notes are created successfully
- ✅ All notes are draggable
- ✅ Positions persist across refreshes
- ✅ Real-time sync works across windows
- ✅ Counter shows accurate count
- ✅ Notes have random colors and rotations
- ✅ UI is responsive
- ✅ No console errors
- ✅ MongoDB stores all data correctly

## Troubleshooting

### Server won't start
- Check if MongoDB is running: `mongod --version`
- Check if port 3001 is available: `lsof -i :3001`
- Verify .env file exists and has correct values

### Client won't connect
- Verify server is running
- Check VITE_SERVER_URL in client/.env
- Check browser console for errors
- Verify CORS settings

### Notes not persisting
- Verify MongoDB connection
- Check server logs for errors
- Verify MONGODB_URI in server/.env
