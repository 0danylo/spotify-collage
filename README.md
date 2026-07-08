# spotify-collage

Collage maker for Spotify playlists.

## OAuth callback configuration

The OAuth callback URL used for Spotify login is resolved in this order:

1. `SPOTIFY_REDIRECT_URI` (preferred)
2. `REDIRECT_URI` (backward compatible)
3. `APP_BASE_URL` + `/callback`
4. Request host/protocol (using forwarded headers when present)

### Security rule

- `http://...` callback URLs are only allowed for localhost development (`localhost`, `127.0.0.1`, `[::1]`).
- Non-local environments must use `https://...` callback URLs.

### Required environment variables

- `CLIENT_SECRET`: Spotify app client secret
- One of:
  - `SPOTIFY_REDIRECT_URI` (recommended), or
  - `REDIRECT_URI`, or
  - `APP_BASE_URL`

### Examples

Local development:

```bash
CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

Production:

```bash
CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=https://your-domain.com/callback
```

or

```bash
CLIENT_SECRET=...
APP_BASE_URL=https://your-domain.com
```

### Spotify Developer Dashboard

In your Spotify app settings, register the **exact same callback URL** used by this app (for example `https://your-domain.com/callback` or `http://localhost:3000/callback` for local development).
