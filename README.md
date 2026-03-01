# PlayMusic - Music Streaming Platform

PlayMusic is a modern music streaming platform built with React, TypeScript, and Node.js. The application provides users with the ability to discover, stream, and manage music with a focus on Indian music genres and categories.

## 🎵 Features

### Core Features
- **User Authentication**: Secure login and registration system with JWT tokens
- **Music Streaming**: Full-featured audio player with playback controls
- **Playlist Management**: Create, edit, and manage personal playlists
- **Like System**: Favorite songs and create a personal collection of liked tracks
- **Music Upload**: Admin functionality for uploading new songs
- **Search & Discovery**: Browse and search for music by various criteria
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Advanced Features
- **Queue Management**: Add songs to a playback queue for continuous listening
- **Volume Control**: Adjustable volume with visual feedback
- **Progress Tracking**: Visual progress bar with seek functionality
- **Social Features**: User profiles and playlist sharing (in development)
- **Admin Dashboard**: Content management interface for administrators

## 🛠️ Tech Stack

### Frontend
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful SVG icons
- **React Hot Toast**: User notifications

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Supabase**: Database and authentication service
- **AWS S3**: Cloud storage for music files
- **JSON Web Tokens (JWT)**: Authentication management
- **Multer**: File upload handling

### Other Technologies
- **ESLint**: Code linting and style enforcement
- **PostCSS**: CSS processing tool
- **Concurrently**: Running multiple npm scripts simultaneously

## 🏗️ Project Structure

```
PlayMusic/
├── server/                 # Backend Express server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and validation middleware
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── src/                    # Frontend React source
│   ├── components/         # React components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party libraries
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
├── supabase/migrations/    # Database migration files
├── docs/                   # Documentation files
├── scripts/                # Utility scripts
├── .env.example            # Environment variables template
├── package.json            # Frontend dependencies
└── server/package.json     # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account
- AWS S3 bucket (for file storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PlayMusic
```

2. Install frontend dependencies:
```bash
npm install
```

3. Navigate to server directory and install backend dependencies:
```bash
cd server
npm install
```

4. Create `.env` files based on `.env.example` in both root and server directories

5. Set up your Supabase database and configure the connection

6. Start the development servers:
```bash
# From the root directory
npm run dev:full
```

This command runs both the frontend (Vite) and backend (Express) servers concurrently.

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
PORT=5000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Music
- `GET /api/music/songs` - Get all songs with pagination/search
- `GET /api/music/songs/:id` - Get specific song
- `POST /api/music/songs` - Upload new song (admin only)
- `GET /api/music/artists` - Get all artists
- `GET /api/music/artists/:id` - Get specific artist
- `GET /api/music/albums` - Get all albums
- `GET /api/music/albums/:id` - Get specific album

### Playlists
- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get specific playlist
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### Likes
- `GET /api/likes` - Get user's liked songs
- `POST /api/likes` - Like a song
- `DELETE /api/likes/:songId` - Unlike a song
- `GET /api/likes/:songId/status` - Check if song is liked

## 🎨 UI Components

The application uses several key components:

- **Sidebar**: Navigation menu for different sections
- **MainContent**: Primary content area with views for home, search, library, etc.
- **Player**: Audio player with playback controls, progress bar, and queue management
- **SongCard**: Display individual songs with play/add to playlist functionality
- **AuthModal**: Authentication interface for login/signup
- **CreatePlaylistModal**: Interface for creating new playlists
- **SelectPlaylistModal**: Interface for adding songs to existing playlists

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

---

Built with ❤️ using React, TypeScript, and Node.js