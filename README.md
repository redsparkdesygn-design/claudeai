# Claude Studio — Netlify + Radox AI

A private, Netlify-hosted chat UI that calls Radox AI from a serverless function. The API key must be stored as a Netlify environment variable; never put it in `index.html` or commit it to GitHub.

## Deploy
1. Upload the contents of this folder to your GitHub repository.
2. Import that repository into Netlify. Build command can be left blank; publish directory is `.`. `netlify.toml` configures the functions directory.
3. In Netlify → Site configuration → Environment variables, add:
   - `RADOXAI_API_KEY` = your Radox AI API key
   - `RADOXAI_MODEL` = the exact model ID available to your Radox AI account
4. Trigger a fresh deploy after saving environment variables.
5. Test the site with a short message. If an error appears, open Netlify → Functions → `chat` → Logs to see the server-side reason.

The function uses `https://radoxai.com/v1/chat/completions` with Bearer authentication. Model availability and attachment/image support depend on the provider and selected model.

## Troubleshooting
- `invalid x-api-key` / 401: verify the key in the Radox AI dashboard; rotate any key shared in chat, and update the Netlify variable.
- Model not found / 400: set `RADOXAI_MODEL` to the exact model identifier shown by Radox AI.
- A blank/non-JSON response: verify the latest deploy included `netlify/functions/chat.mjs`; inspect the `chat` function logs.
- After changing variables or code, redeploy the site.
