/*
  # Seed Sample Data for ydvmusic

  1. Sample Data
    - Insert sample artists
    - Insert sample albums
    - Insert sample songs
    - Create default genres
*/

-- Insert sample artists
INSERT INTO artists (name, bio, image_url) VALUES
  ('Papon', 'Indian singer and music director from Assam', 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('The Weeknd', 'Canadian singer, songwriter and record producer', 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Harry Styles', 'English singer, songwriter and actor', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Dua Lipa', 'English singer and songwriter', 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Olivia Rodrigo', 'American singer-songwriter and actress', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Ed Sheeran', 'English singer-songwriter', 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Taylor Swift', 'American singer-songwriter', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Billie Eilish', 'American singer-songwriter', 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300'),
  ('Drake', 'Canadian rapper, singer and songwriter', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300')
ON CONFLICT (name) DO NOTHING;

-- Insert sample albums
INSERT INTO albums (title, artist_id, cover_url, release_date, genre)
SELECT 
  album_data.title,
  a.id,
  album_data.cover_url,
  album_data.release_date::date,
  album_data.genre
FROM (VALUES
  ('After Hours', 'The Weeknd', 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300', '2020-03-20', 'R&B'),
  ('Fine Line', 'Harry Styles', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300', '2019-12-13', 'Pop'),
  ('Future Nostalgia', 'Dua Lipa', 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300', '2020-03-27', 'Pop'),
  ('SOUR', 'Olivia Rodrigo', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300', '2021-05-21', 'Pop'),
  ('÷ (Divide)', 'Ed Sheeran', 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300', '2017-03-03', 'Pop'),
  ('1989', 'Taylor Swift', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300', '2014-10-27', 'Pop'),
  ('When We All Fall Asleep, Where Do We Go?', 'Billie Eilish', 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300', '2019-03-29', 'Alternative'),
  ('Scorpion', 'Drake', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300', '2018-06-29', 'Hip-Hop')
) AS album_data(title, artist_name, cover_url, release_date, genre)
JOIN artists a ON a.name = album_data.artist_name;

-- Insert sample songs with audio URLs
INSERT INTO songs (title, artist_id, album_id, duration, audio_url, genre)
SELECT 
  song_data.title,
  a.id,
  al.id,
  song_data.duration,
  song_data.audio_url,
  song_data.genre
FROM (VALUES
  ('Yeh Ishq Hai', 'Papon', 'After Hours', 240, '/audio/Yeh Ishq Hai Papon Version-64kbps.mp3', 'Bollywood'),
) AS song_data(title, artist_name, album_name, duration, audio_url, genre)
JOIN artists a ON a.name = song_data.artist_name
JOIN albums al ON al.title = song_data.album_name AND al.artist_id = a.id;