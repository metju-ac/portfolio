# How to Add Music to the Playlist

The music player reads tracks from `src/data/playlist-data.json` and plays MP3 files from `public/musics/`.

## Steps

### 1. Add the MP3 file

Place your MP3 file in `public/musics/`. Name it using a unique ID (e.g., a Spotify track ID or any slug):

```
public/musics/YOUR_TRACK_ID.mp3
```

### 2. Add the album cover image

Place a WebP album cover image in `public/img/album-covers/` with the same ID:

```
public/img/album-covers/YOUR_TRACK_ID.webp
```

### 3. Add the track entry to playlist-data.json

Open `src/data/playlist-data.json` and add an entry to `tracks.items`:

```json
{
  "id": "YOUR_TRACK_ID",
  "name": "Song Title",
  "album": {
    "name": "Album Name",
    "images": [
      {
        "url": "/img/album-covers/YOUR_TRACK_ID.webp"
      }
    ],
    "external_urls": {
      "spotify": "https://open.spotify.com/track/...",
      "deezer": "https://www.deezer.com/us/track/..."
    }
  },
  "artists": [
    {
      "name": "Artist Name"
    }
  ],
  "added_at": "2026-01-01T00:00:00Z",
  "duration_ms": 180000
}
```

### 4. Update the track count

Update the `tracks.length` field to match the number of items in the array.

### Field reference

| Field                         | Description                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `id`                          | Unique identifier. Must match the MP3 filename (without `.mp3`) and album cover filename (without `.webp`) |
| `name`                        | Song title displayed in the playlist                                                                       |
| `album.name`                  | Album name shown in the album column                                                                       |
| `album.images[0].url`         | Path to album cover (relative to public root)                                                              |
| `album.external_urls.spotify` | Spotify link (shown as clickable icon)                                                                     |
| `album.external_urls.deezer`  | Deezer link (shown as clickable icon)                                                                      |
| `artists[0].name`             | Artist name displayed under the song title                                                                 |
| `added_at`                    | ISO 8601 date string; used for "added" column display                                                      |
| `duration_ms`                 | Track duration in milliseconds; used for duration display and auto-advance to next track                   |

### Notes

- The `duration_ms` should match the actual MP3 duration for accurate playback tracking.
- The `added_at` date is purely cosmetic -- dates older than 1 month show as formatted dates, recent ones show as "X days ago".
- External URLs (Spotify/Deezer) are optional but the fields must exist (can be empty strings).
