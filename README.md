# Claude Studio — Netlify + Radox AI

This project calls Radox AI from a Netlify serverless function. Keep the API key in Netlify environment variables; never put it in `index.html` or commit it to GitHub.

## Important: deploy the project root

When uploading this ZIP to GitHub, upload the **contents of this ZIP to the repository root**. The repository root should contain `index.html`, `netlify.toml`, `package.json`, and the `netlify/functions/chat.mjs` file.

## Netlify setup

1. In Netlify, open the site and confirm it is connected to the GitHub repository containing those root files.
2. In Site configuration → Build & deploy → Build settings, use publish directory `.` and leave the build command blank.
3. In Site configuration → Environment variables, add:
   - `RADOXAI_API_KEY` = your Radox AI API key
   - `RADOXAI_MODEL` = the exact model ID available to your Radox AI account
4. Trigger a fresh deploy after adding the variables.
5. In Netlify, open Functions and check that a function named `chat` exists. If it is missing, the deployed repo/root directory is wrong or the latest deploy did not include `netlify/functions/chat.mjs`.
6. Test the website with a short message.

The function calls `https://radoxai.com/v1/chat/completions` with Bearer authentication. Model availability and attachment/image support depend on the provider and selected model.

## Troubleshooting

- `Unexpected token '<'` or `<!DOCTYPE` in the chat: the endpoint returned an HTML page instead of JSON. Check that Netlify deployed `netlify/functions/chat.mjs` and that the `chat` function appears under Netlify → Functions.
- `401` / invalid key: verify the key in Radox AI and update `RADOXAI_API_KEY`. Rotate any key shared in chat.
- Model not found / `400`: set `RADOXAI_MODEL` to the exact model identifier shown in your Radox AI dashboard.
- After changing code or environment variables, trigger a new deploy.
