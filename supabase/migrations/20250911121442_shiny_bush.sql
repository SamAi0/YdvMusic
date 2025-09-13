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
  ('Blinding Lights', 'The Weeknd', 'After Hours', 200, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'R&B'),
  ('Watermelon Sugar', 'Harry Styles', 'Fine Line', 174, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'Pop'),
  ('Levitating', 'Dua Lipa', 'Future Nostalgia', 203, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'Pop'),
  ('Good 4 U', 'Olivia Rodrigo', 'SOUR', 178, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'Pop'),
  ('Shape of You', 'Ed Sheeran', '÷ (Divide)', 233, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'Pop'),
  ('Shake It Off', 'Taylor Swift', '1989', 219, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'Pop'),
  ('Bad Guy', 'Billie Eilish', 'When We All Fall Asleep, Where Do We Go?', 194, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'Alternative'),
  ('God''s Plan', 'Drake', 'Scorpion', 198, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'Hip-Hop'),
  ('Save Your Tears', 'The Weeknd', 'After Hours', 215, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 'R&B'),
  ('As It Was', 'Harry Styles', 'Fine Line', 167, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 'Pop'),
  ('Don''t Start Now', 'Dua Lipa', 'Future Nostalgia', 183, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 'Pop'),
  ('drivers license', 'Olivia Rodrigo', 'SOUR', 242, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 'Pop'),
  ('Perfect', 'Ed Sheeran', '÷ (Divide)', 263, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 'Pop'),
  ('Anti-Hero', 'Taylor Swift', '1989', 200, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 'Pop'),
  ('Lovely', 'Billie Eilish', 'When We All Fall Asleep, Where Do We Go?', 200, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 'Alternative'),
  ('In My Feelings', 'Drake', 'Scorpion', 218, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 'Hip-Hop')
) AS song_data(title, artist_name, album_name, duration, audio_url, genre)
JOIN artists a ON a.name = song_data.artist_name
JOIN albums al ON al.title = song_data.album_name AND al.artist_id = a.id;