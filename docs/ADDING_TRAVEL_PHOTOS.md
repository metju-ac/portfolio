# Adding Travel Photos

The `TravelPhotos` window displays photos and videos from Cloudinary, organised into trip folders.

## Prerequisites

1. A Cloudinary account with your travel media already uploaded.
2. Each folder's files must be **tagged** with the folder name (e.g. all files in `2023_03_madeira` must have the tag `2023_03_madeira`).
3. In your Cloudinary account settings, set **Resource list** to **Public** so the list URLs work without authentication.
   - Go to: Console → Settings → Security → Restricted media types → uncheck "Resource list"

## Configuration

Add your Cloudinary cloud name to `.env` (or `.env.local`):

```
VITE_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

No API key or secret is required. Assets are fetched via public list URLs:

```
https://res.cloudinary.com/{cloud_name}/image/list/{tag}.json
https://res.cloudinary.com/{cloud_name}/video/list/{tag}.json
```

## Folder Structure

The folder tree is defined in `src/data/travel-photos-data.json`. Each entry has:

- `id` — unique identifier (matches the Cloudinary tag)
- `label` — human-readable name displayed in the UI
- `tag` — the Cloudinary tag used to fetch assets (`null` for container folders with subfolders)
- `subfolders` — optional array of sub-entries (only used by `2023_usa`)

### Adding a New Trip

1. Upload photos/videos to Cloudinary and tag them with your chosen tag name (e.g. `2027_05_japan`).
2. Add an entry to `src/data/travel-photos-data.json`:

```json
{ "id": "2027_05_japan", "label": "Japan 2027", "tag": "2027_05_japan" }
```

Insert it in chronological order in the `folders` array.

### Adding a Trip with Subfolders

If the trip has multiple legs (like `2023_usa`), use `subfolders` and set `tag: null` on the parent:

```json
{
  "id": "2027_05_japan",
  "label": "Japan 2027",
  "tag": null,
  "subfolders": [
    { "id": "01_tokyo", "label": "Tokyo", "tag": "01_tokyo" },
    { "id": "02_kyoto", "label": "Kyoto", "tag": "02_kyoto" }
  ]
}
```

## How It Works

- **Root view**: a grid of all trip folders.
- **Trip with subfolders**: clicking it shows a grid of its sub-folders.
- **Media view**: clicking a leaf folder fetches all images and videos tagged with that folder's tag from Cloudinary and displays them in a Windows XP-style picture viewer (thumbnail strip + main viewer).
- Videos are played inline with a native `<video>` element; images support rotation.

## Component Files

| File                                      | Purpose                     |
| ----------------------------------------- | --------------------------- |
| `src/components/Windows/TravelPhotos.vue` | Main window component       |
| `src/data/travel-photos-data.json`        | Folder structure definition |

## Troubleshooting

- **No photos load**: Check that `VITE_APP_CLOUDINARY_CLOUD_NAME` is set and that the tag name in `travel-photos-data.json` exactly matches the tag on Cloudinary (case-sensitive).
- **401/403 errors on the list URL**: Make sure "Resource list" is set to Public in Cloudinary security settings.
- **Empty folder**: The tag may exist but have no assets attached, or the tag name doesn't match.
