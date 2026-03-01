import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// Note: passport-apple doesn't seem to have official TypeScript support yet
import AppleStrategy from 'passport-apple';

import { supabase } from './database.js';

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/oauth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('google_id', profile.id)
            .single();

          if (existingUser) {
            return done(null, existingUser);
          }

          // Create new user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              google_id: profile.id,
              email: profile.emails?.[0]?.value,
              full_name: profile.displayName,
              avatar_url: profile.photos?.[0]?.value,
              provider: 'google',
            })
            .select()
            .single();

          if (createError) {
            return done(createError, null);
          }

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google OAuth not configured. Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables.');
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/oauth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'picture'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('facebook_id', profile.id)
            .single();

          if (existingUser) {
            return done(null, existingUser);
          }

          // Create new user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              facebook_id: profile.id,
              email: profile.emails?.[0]?.value,
              full_name: `${profile.name?.givenName} ${profile.name?.familyName}`,
              avatar_url: profile.photos?.[0]?.value,
              provider: 'facebook',
            })
            .select()
            .single();

          if (createError) {
            return done(createError, null);
          }

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Facebook OAuth not configured. Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET in environment variables.');
}

// Apple OAuth Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        callbackURL: '/api/oauth/apple/callback',
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY,
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Check if user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('apple_id', profile.id)
            .single();

          if (existingUser) {
            return done(null, existingUser);
          }

          // Create new user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              apple_id: profile.id,
              email: profile.email,
              full_name: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : null,
              provider: 'apple',
            })
            .select()
            .single();

          if (createError) {
            return done(createError, null);
          }

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Apple OAuth not configured. Missing APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, or APPLE_PRIVATE_KEY in environment variables.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return done(error, null);
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;