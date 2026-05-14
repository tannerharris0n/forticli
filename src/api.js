import { STORAGE_KEY_API, STORAGE_KEY_MODEL, DEFAULT_MODEL } from './config';

export function getApiKey() {
  try { return localStorage.getItem(STORAGE_KEY_API) || ''; } catch { return ''; }
}
export function setApiKey(key) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY_API, key);
    else localStorage.removeItem(STORAGE_KEY_API);
  } catch {}
}
export function getModel() {
  try { return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL; } catch { return DEFAULT_MODEL; }
}
export function setModel(m) {
  try {
    if (m) localStorage.setItem(STORAGE_KEY_MODEL, m);
    else localStorage.removeItem(STORAGE_KEY_MODEL);
  } catch {}
}

// Direct browser call to api.anthropic.com using the user's locally-stored
// API key. Requires the `anthropic-dangerous-direct-browser-calls` header to
// be acknowledged — the key never leaves the browser. This is intentional:
// FortiCLI is a static-only app, by design, so anyone can host it on GitHub
// Pages / Netlify / Vercel with no server.
export async function callClaude({ system, messages, max_tokens = 4000 }) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const model = getModel();
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body: JSON.stringify({ model, max_tokens, system, messages }),
    });
  } catch (e) {
    throw new Error('Network error reaching api.anthropic.com. Check your connection.');
  }

  let data;
  try { data = await res.json(); }
  catch { throw new Error(`API error: ${res.status} ${res.statusText}`); }

  if (!res.ok || data?.error) {
    const msg = data?.error?.message || `API error: ${res.status}`;
    if (res.status === 401) throw new Error('Invalid API key. Update it in Settings.');
    throw new Error(msg);
  }
  return data;
}
