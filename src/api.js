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
const TRANSIENT_STATUSES = new Set([502, 503, 504, 529]);
const MAX_ATTEMPTS = 3;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function callClaude({ system, messages, max_tokens = 4000 }) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const model = getModel();
  const body = JSON.stringify({ model, max_tokens, system, messages });

  let lastStatus = 0;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
        body,
      });
    } catch (e) {
      // Network-layer failure — treat as transient and retry.
      if (attempt < MAX_ATTEMPTS) { await sleep(700 * attempt); continue; }
      throw new Error('Network error reaching api.anthropic.com. Check your connection.');
    }

    if (TRANSIENT_STATUSES.has(res.status) && attempt < MAX_ATTEMPTS) {
      lastStatus = res.status;
      await sleep(700 * attempt + Math.random() * 300);
      continue;
    }

    let data;
    try { data = await res.json(); }
    catch { throw new Error(`API error: ${res.status} ${res.statusText}`); }

    if (!res.ok || data?.error) {
      if (res.status === 401) throw new Error('Invalid API key. Update it in Settings.');
      if (TRANSIENT_STATUSES.has(res.status)) {
        throw new Error(`Anthropic API is temporarily unavailable (${res.status}) after ${MAX_ATTEMPTS} attempts. Please retry in a moment.`);
      }
      const msg = data?.error?.message || `API error: ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  throw new Error(`Anthropic API is temporarily unavailable (${lastStatus || 'network'}) after ${MAX_ATTEMPTS} attempts. Please retry in a moment.`);
}
