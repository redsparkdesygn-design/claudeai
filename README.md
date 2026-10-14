# Claude Studio — Netlify Ready

A responsive Claude-style AI workspace with a Netlify Functions backend. The API key is read only on the server from an environment variable and is not included in the browser bundle or this ZIP.

## Deploy

1. Extract this ZIP.
2. Upload the `claude-netlify-app` folder to a **private GitHub repository**.
3. In Netlify, choose **Add new project → Import an existing project** and connect the repository.
4. Build settings: publish directory `.`; functions directory `netlify/functions` (also configured in `netlify.toml`).
5. In Netlify, open **Site configuration → Environment variables** and add:
   - `ANTHROPIC_API_KEY` — your valid API key for the provider used by the backend.
   - `ANTHROPIC_MODEL` — the exact model identifier supported by that provider/account.
6. Save and trigger a fresh deploy.
7. Test a text prompt, then an attachment.

## API key warning

Do not put a secret key in `index.html`, frontend JavaScript, GitHub, or any publicly downloadable file. A key shared in a chat should be treated as exposed: revoke it and create a new one before use. The key prefix alone does not confirm which provider issued it. This project currently calls the official Anthropic Messages endpoint (`https://api.anthropic.com/v1/messages`) and expects a key accepted by that endpoint. If your `cc_` key belongs to a third-party gateway or a different service, its documented API base URL and authentication format must be configured in `netlify/functions/chat.mjs` instead.

## Attachments

- Images: PNG, JPEG, GIF, WebP (sent as image inputs)
- PDF: text extraction in the browser; scanned/image-only PDFs may return little or no text
- DOCX: text extraction
- XLS/XLSX: sheets converted to CSV text
- TXT, Markdown, CSV, JSON, HTML, CSS, JS/TS, Python, and common text/code files
- Multiple files and drag-and-drop are supported

Per-file browser limit: 12 MB. File content is sent to the configured API and is not stored by this starter. Browser-side PDF.js, Mammoth, and SheetJS are loaded from CDNs.

## Important

This is a personal starter. It does not include login or rate limiting. Do not share the deployed URL publicly until you add access protection, otherwise visitors may consume your API quota. The default model ID may need to be changed to the exact model ID available to your account.
