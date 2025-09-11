import { supabase } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify Supabase JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
      }
    } catch (error) {
      // Continue without user if token is invalid
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = (req.user?.email || '').toLowerCase();

  const isAdmin =
    req.user?.user_metadata?.is_admin === true ||
    req.user?.app_metadata?.roles?.includes('admin') ||
    (adminEmails.length > 0 && adminEmails.includes(userEmail));
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};