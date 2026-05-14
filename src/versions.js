// Versions loader. Single source of truth lives in `versions.json` at the
// repo root. To handle new firmware releases without redeploying every fork:
//
//   1. Edit versions.json on `main`
//   2. Commit + push
//   3. All deployed clients pick it up within 24 hours
//      (sooner if they clear localStorage)
//
// The remote fetch is best-effort — if it fails (offline, CORS hiccup, repo
// down) we fall back to the bundled snapshot below, so the app always works.

const VERSIONS_URL = 'https://raw.githubusercontent.com/tannerharris0n/forticli/main/versions.json';
const CACHE_KEY = 'forticli:versions_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Bundled fallback — keep in sync with versions.json. This is what users see
// before the remote fetch lands (and what they fall back to if it fails).
export const FALLBACK_VERSIONS = {
  cheatsheet: {
    "FortiGate": ["7.6.2", "7.6.1", "7.6.0", "7.4.7", "7.4.6", "7.4.5", "7.4.4", "7.4.3", "7.4.2", "7.4.1", "7.4.0", "7.2.11", "7.2.10", "7.2.9", "7.2.8", "7.2.7", "7.0.17", "7.0.16", "7.0.15", "7.0.14", "6.4.15", "6.4.14"],
    "FortiSwitch": ["7.6.0", "7.4.4", "7.4.3", "7.4.2", "7.4.1", "7.4.0", "7.2.8", "7.2.7", "7.2.6", "7.0.8", "7.0.7", "6.4.13"],
    "FortiAP": ["7.4.4", "7.4.3", "7.4.2", "7.2.6", "7.2.5", "7.0.7", "7.0.6", "7.0.5"],
    "FortiAnalyzer": ["7.6.2", "7.6.1", "7.6.0", "7.4.5", "7.4.4", "7.4.3", "7.4.2", "7.2.7", "7.2.6", "7.0.13", "7.0.12"],
    "FortiManager": ["7.6.2", "7.6.1", "7.6.0", "7.4.5", "7.4.4", "7.4.3", "7.4.2", "7.2.7", "7.2.6", "7.0.13", "7.0.12"],
    "FortiAuthenticator": ["6.6.2", "6.6.1", "6.6.0", "6.5.4", "6.5.3", "6.5.2", "6.4.3"],
    "FortiDeceptor": ["6.0.2", "6.0.1", "5.3.1", "5.3.0"],
    "FortiNAC": ["10.3.5", "10.3.4", "10.2.0", "9.4.7", "9.4.6"],
    "FortiProxy": ["7.4.4", "7.4.3", "7.4.2", "7.2.10", "7.2.9", "7.2.8", "7.0.13", "7.0.12"],
  },
  diffBranches: ["7.6.x", "7.4.x", "7.2.x", "7.0.x", "6.4.x", "6.2.x"],
};

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.fetchedAt || !parsed?.data) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch { return null; }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), data })); } catch {}
}

function validate(data) {
  return data
    && typeof data === 'object'
    && data.cheatsheet
    && typeof data.cheatsheet === 'object'
    && Array.isArray(data.diffBranches);
}

export async function loadVersions() {
  const cached = readCache();
  if (cached) return cached;

  try {
    const res = await fetch(VERSIONS_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (validate(data)) {
        writeCache(data);
        return data;
      }
    }
  } catch { /* network or parse error — fall through */ }

  return FALLBACK_VERSIONS;
}
