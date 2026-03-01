import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

// Import routes
import authRoutes from './routes/auth.js';
import musicRoutes from './routes/music.js';
import playlistRoutes from './routes/playlists.js';
import likesRoutes from './routes/likes.js';
import oauthRoutes from './routes/oauth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Simple in-memory rate limiter ──────────────────────────────────────────
const rateLimitMap = new Map();

const createRateLimiter = (windowMs, maxRequests, message) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const entry = rateLimitMap.get(key);

    if (now > entry.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    return next();
  };
};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(key);
  }
}, 5 * 60 * 1000);

// General API rate limiter: 200 req / 15 min
const generalLimiter = createRateLimiter(15 * 60 * 1000, 200, 'Too many requests, please try again later.');

// Auth-specific rate limiter: 20 req / 15 min
const authLimiter = createRateLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts, please try again later.');

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Warn about missing secrets
if (!process.env.SESSION_SECRET) {
  console.warn('⚠️  SESSION_SECRET not set. Using default — change this in production!');
}

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/oauth', oauthRoutes);

// ─── Error handling ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large' });
  if (err.message === 'Only audio files are allowed!' || err.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🛡️  Rate limiting: 200 req/15min (general), 20 req/15min (auth)`);

  if (!process.env.GOOGLE_CLIENT_ID) console.log('🔔 Google OAuth not configured');
  if (!process.env.FACEBOOK_APP_ID) console.log('🔔 Facebook OAuth not configured');
  if (!process.env.APPLE_CLIENT_ID) console.log('🔔 Apple OAuth not configured');
});

export default app;