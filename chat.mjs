const MAX_CHARS = 180000;
const RADOXAI_BASE_URL = 'https://radoxai.com/v1';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const apiKey = process.env.RADOXAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return json({ error: 'Missing RADOXAI_API_KEY. Add it in Netlify → Site configuration → Environment variables, then redeploy.' }, 500);

    const body = await req.json();
    const message = String(body.message || '').slice(0, 30000);
    const files = Array.isArray(body.files) ? body.files : [];
    const userContent = [];
    let totalChars = 0;

    for (const f of files) {
      if (f.kind === 'image') {
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.mediaType)) continue;
        userContent.push({ type: 'text', text: `Attached image: ${String(f.name).slice(0, 200)}` });
        userContent.push({ type: 'image_url', image_url: { url: `data:${f.mediaType};base64,${String(f.content || '')}` } });
      } else if (f.kind === 'text') {
        const value = String(f.content || '');
        const remaining = Math.max(0, MAX_CHARS - totalChars);
        if (remaining > 0) {
          userContent.push({ type: 'text', text: `ATTACHED FILE: ${String(f.name).slice(0, 200)}\n${value.slice(0, remaining)}` });
          totalChars += Math.min(value.length, remaining);
        }
      }
    }
    userContent.push({ type: 'text', text: message || 'Please analyze the attached files.' });

    const history = Array.isArray(body.history) ? body.history.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 12000)
    })) : [];

    // Radox AI uses an OpenAI-compatible Chat Completions API, not api.anthropic.com.
    const model = process.env.RADOXAI_MODEL || process.env.ANTHROPIC_MODEL || 'claude-opus-4.8';
    const upstream = await fetch(`${RADOXAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: 'You are Claude, a helpful assistant. When attachments are provided, use their contents and clearly mention if a file could not be interpreted. Be accurate, practical, and concise unless asked for detail.' },
          ...history,
          { role: 'user', content: userContent }
        ]
      })
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const detail = result?.error?.message || result?.message || `Radox AI API error (${upstream.status}). Check your key, model ID, scopes, and plan allowance.`;
      return json({ error: detail }, upstream.status);
    }
    const text = result?.choices?.[0]?.message?.content;
    const normalized = Array.isArray(text) ? text.map(part => part.text || '').join('\n') : String(text || '');
    if (!normalized) return json({ error: 'The provider returned an empty response. Try another model or check its capabilities.' }, 502);
    return json({ text: normalized, model: result.model || model });
  } catch (err) {
    return json({ error: err?.message || 'Unexpected server error' }, 500);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
