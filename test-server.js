// Temporary test server to check if API connection works
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/music/songs', (req, res) => {
  console.log('✅ API call received!');
  res.json([
    {
      id: '1',
      title: 'Test Song',
      duration: 180,
      genre: 'Test',
      audio_url: '/audio/Yeh Ishq Hai Papon Version-64kbps.mp3',
      artist: { id: '1', name: 'Test Artist', image_url: null },
      album: { id: '1', title: 'Test Album', cover_url: null }
    }
  ]);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive API calls from frontend`);
});