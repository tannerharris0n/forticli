<img width="541" height="704" alt="Screenshot 2026-05-14 at 11 05 00 AM" src="https://github.com/user-attachments/assets/5c73939d-15ff-45e6-87ba-0accda7c9d1b" /># FortiCLI Reference

> AI-generated Fortinet CLI cheat sheets and FortiOS version diffs, with PDF export. **Bring your own Anthropic API key** — no server, no backend, no account, no telemetry.

> **⚠️ Independent project — not a Fortinet GitHub account.**
>
> This repository is **not** a Fortinet GitHub account, repository, or product. FortiCLI is built and maintained independently by [Tanner Harrison](https://tannerharrison.com) and is **not** endorsed, sponsored, reviewed, or supported by Fortinet, Inc. Views and code here are the maintainer's own and do not represent any employer. All Fortinet product names, trademarks, and logos are property of Fortinet, Inc. Output is AI-generated — always validate against the [official Fortinet documentation](https://docs.fortinet.com) before applying CLI to production gear.

FortiCLI is a 100% static single-page app. You paste your Anthropic API key once, it lives in your browser's `localStorage`, and every request goes **directly** from your browser to `api.anthropic.com`. No middleman, no database, no analytics. Clone it, host it anywhere, fork it, or just run it locally.

---

## Table of contents

- [What it does](#what-it-does)
- [Screenshots / output](#screenshots--output)
- [Quick start](#quick-start)
  - [Option 1: Run locally](#option-1-run-locally)
  - [Option 2: Deploy to Vercel / Netlify](#option-2-deploy-to-vercel--netlify)
  - [Option 3: Host on GitHub Pages](#option-3-host-on-github-pages)
- [Get an Anthropic API key](#get-an-anthropic-api-key)
- [Privacy &amp; how data flows](#privacy--how-data-flows)
- [Cost expectations](#cost-expectations)
- [Configuration](#configuration)
- [Features in detail](#features-in-detail)
- [Project structure](#project-structure)
- [Customizing / extending](#customizing--extending)
- [Troubleshooting](#troubleshooting)
- [Limitations &amp; honest caveats](#limitations--honest-caveats)
- [Contributing](#contributing)
- [License](#license)

---

## What it does

Two tabs:

### 1. **CLI Cheat Sheet**
Pick a Fortinet product (FortiGate, FortiSwitch, FortiAP, FortiAnalyzer, FortiManager, FortiAuthenticator, FortiDeceptor, FortiNAC, FortiProxy), type a firmware version, toggle which categories you want, hit Generate. You get back a poster-style cheat sheet with every section visible at once — designed to skim, pin to your second monitor, or print and tape to the wall.

- Multi-column visual layout (Wireshark-cheat-sheet style)
- Click any command in the poster to copy it
- Full reference view below with detailed notes per command
- Export to **.txt** (plain text, comment-friendly) or **PDF** (Fortinet-red branded, paginated tables)
- Direct links to the official Fortinet docs for your product + version (product hub, CLI Reference, Admin Guide, Release Notes, What's New)

### 2. **Version Diff**
Pick two FortiOS versions (e.g. `7.2.x` → `7.4.x`), hit Generate. You get:

- **Added** — new CLI in the newer release (green)
- **Changed** — old vs new syntax side-by-side (amber)
- **Removed** — CLI that no longer exists (red)
- An executive summary of the biggest shifts
- Every entry tagged with its functional area (SD-WAN, BGP, HA, etc.)
- PDF export with a separate color-coded table per category

The diff covers the **entire FortiOS CLI surface** — system, routing, VPN, SD-WAN, HA, firewall, NAT, certificates, VDOM, logging, FortiGuard, wireless, debugging. No topic filter to wrestle with.

---

## Screenshots / output

![Upload<img width="541" height="704" alt="Screenshot 2026-05-14 at 11 04 55 AM" src="https://github.com/user-attachments/assets/2c7742cf-a7c0-425d-9942-4bacb5490339" /><img width="541" height="704" alt="Screenshot 2026-05-14 at 11 04 32 AM" src="https://github.com/user-attachments/assets/4d1c0a98-41bd-473f-9161-db75a79bab2e" />
[fortigate-cli-diff-7-0-x-to-7-4-x.pdf](https://github.com/user-attachments/files/27771378/fortigate-cli-diff-7-0-x-to-7-4-x.pdf)
ing Screenshot 2026-05-14 at 11.05.00 AM.png…]()


PDFs include:
- Fortinet-red accent line and headers
- Paginated tables with alternating row shading
- Footer on each page with product, version, and date
- Monospace command columns, sensible page breaks between sections
- Sensible filenames: `fortigate-cli-v7.4.4-cheatsheet.pdf`, `fortigate-cli-diff-7-2-x-to-7-4-x.pdf`

---

## Quick start

### Option 1: Run locally

```bash
git clone https://github.com/tannerharris0n/forticli.git
cd forticli
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste your Anthropic API key into the onboarding screen, done.

To produce a production build:

```bash
npm run build
npm run preview   # serves the built /dist locally to verify
```

The `dist/` folder is fully static — no Node runtime needed in production. Drop it on any web host.

### Option 2: Deploy to Vercel / Netlify

Both work zero-config because Vite is detected automatically.

**Vercel:**
1. Push the repo to your GitHub account
2. [vercel.com/new](https://vercel.com/new) → import the repo
3. Framework preset auto-detects as Vite. Build command `npm run build`, output `dist`. Click Deploy.
4. Visit your `*.vercel.app` URL.

**Netlify:**
1. [app.netlify.com/start](https://app.netlify.com/start) → connect repo
2. Build command: `npm run build`, publish directory: `dist`. Deploy.

Because everything runs in the browser with the user's own API key, **you do not need to configure any environment variables on the host.** Anyone visiting your deploy just pastes their own key.

### Option 3: Host on GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

Then:

```bash
npm run deploy
```

In your repo settings → Pages, set the source to the `gh-pages` branch. The `base: './'` setting in `vite.config.js` is already configured so paths work under a subdirectory.

---

## Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up (or sign in) and add a payment method — Anthropic API usage is metered per token
3. Navigate to **Settings → API Keys** → **Create key**
4. Copy the key (starts with `sk-ant-`) — Anthropic only shows it once
5. Paste it into FortiCLI's onboarding screen

You can revoke or rotate the key any time from the Anthropic console. FortiCLI will start failing with `Invalid API key` and prompt you to update it in Settings.

---

## Privacy & how data flows

This part matters, so it gets its own section.

```
┌─────────────┐      HTTPS, direct       ┌──────────────────────┐
│  Your       │ ───────────────────────► │  api.anthropic.com   │
│  browser    │                          │  (Anthropic)         │
│             │ ◄─────────────────────── │                      │
└─────────────┘                          └──────────────────────┘
       │
       │  Key stored in:
       │  localStorage["forticli:anthropic_api_key"]
       ▼
```

- **No backend.** This repo has zero server code. There is nothing to compromise, intercept, or log.
- **Your API key never leaves your browser** except as the `x-api-key` header on requests to Anthropic.
- **The author cannot see your key, prompts, or output.** Even if you visit the author's hosted demo, the request goes from *your* browser to Anthropic, not through any server.
- **No analytics, no third-party scripts, no tracking pixels.** Check `index.html` and the network tab — there's nothing else loaded.
- **The browser console has full visibility.** If you want to audit a request, open DevTools → Network → look at any `/v1/messages` call.

If you'd rather not store the key in `localStorage`, just clear browser data when you're done — or open the app in a private/incognito window and re-paste the key each session.

### The `anthropic-dangerous-direct-browser-calls` header

Anthropic requires explicit acknowledgment that you're calling their API directly from a browser. FortiCLI sets this header automatically. Why "dangerous"? Because **if you put your own API key in a shared/public browser, anyone with access to that browser can use it.** Treat the key like a credit card — your machine only.

### CORS

`api.anthropic.com` supports CORS for requests with the dangerous-direct-browser-calls header, so the browser can call it directly without a proxy. This is by design and Anthropic-documented.

---

## Cost expectations

Approximate per-generation cost using **Claude Sonnet 4.5** (the recommended default), assuming 2026 pricing:

| Action                                | Input tokens | Output tokens | Approx. cost |
|---------------------------------------|-------------:|--------------:|-------------:|
| Cheat sheet (all FortiGate categories)|        ~600  |        ~6,500 |   **$0.10**  |
| Cheat sheet (1–2 categories only)     |        ~250  |        ~1,500 |   **$0.025** |
| FortiOS version diff                  |        ~500  |        ~6,000 |   **$0.09**  |

These are estimates — check Anthropic's current pricing page. Switch to **Haiku 4.5** in Settings to cut costs ~5× at the price of a small quality drop. Switch to **Opus 4.7** for noticeably better output at ~3× the cost.

Anthropic enforces rate limits per account tier; FortiCLI surfaces those directly as errors in the UI when you hit them.

---

## Configuration

Everything user-facing is in the **Settings** dialog (top right of the app). For developers, the source-level knobs:

### `src/config.js`

```js
export const DEFAULT_MODEL = 'claude-sonnet-4-5';

export const MODEL_OPTIONS = [
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (recommended)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-7',   label: 'Claude Opus 4.7 (best quality, slower)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest, cheapest)' },
];
```

Edit this file to change the default model, add new model options, or remove ones your account doesn't have access to.

### `src/FortiCLI.jsx`

Top-of-file constants control product/category metadata:

- `PRODUCTS` — product dropdown
- `PRODUCT_CATS` — categories per product
- `PRODUCT_DOC_SLUG` — maps display name to `docs.fortinet.com` URL slug

The system prompts and JSON shapes for both features are in this file too — search for `CHEAT_SYSTEM`, `DIFF_SYSTEM`, `buildCheatPrompt`, `buildDiffPrompt`.

### `versions.json` — handling new firmware releases

Firmware version dropdowns are populated from `versions.json` at the repo root. **This is the single source of truth.** When Fortinet ships a new release:

1. Edit `versions.json` on `main` — add the new version string to the relevant product array (newest first)
2. `git commit -m "versions: add FortiGate 7.6.3"` and push
3. **Every deployed instance picks it up automatically within 24 hours** — the app fetches `versions.json` from `raw.githubusercontent.com/tannerharris0n/forticli/main/versions.json` on load, caches it in `localStorage` with a 24h TTL, and falls back to the bundled snapshot if the fetch fails

This means a single PR can update dropdowns for the standalone deploy, anyone's fork, and any other app that points to the same URL (the maintainer's adhd-tools instance does, for example).

If the remote fetch fails (offline, repo down, CORS hiccup), the bundled `FALLBACK_VERSIONS` in `src/versions.js` keeps the app working — keep that copy in sync with `versions.json` when you cut a release.

**Validation rule:** only list a version if `https://docs.fortinet.com/product/<slug>/<version>` actually resolves. The "Fortinet documentation" panel in the UI links straight there, and broken links are worse than missing versions.

### `max_tokens`

Both generations request 8000 output tokens. Increase in code if you want more exhaustive output — Sonnet 4.x supports much higher max_tokens. The UI surfaces a banner if the response was clipped (model hit `stop_reason: 'max_tokens'`), and the JSON parser recovers as much of the truncated array as possible.

---

## Features in detail

### Poster-style cheat sheet view

Multi-column CSS grid; every section visible at once; click any command to copy. Designed to print well — `break-inside: avoid` on section cards keeps things together across page breaks.

### Full-reference view (below the poster)

Same data, more breathing room — full descriptions, notes ("caveats / gotchas"), and per-command copy buttons. Use this when you need context, not just commands.

### Two export formats

- **`.txt`** — plain text, section headers prefixed `##`, descriptions as `#` comments above each command. Works great as a starting point for personal notes or to drop into Notion / Obsidian.
- **PDF** — programmatic (jsPDF, no html2canvas) with paginated `autotable` layouts. Fortinet-red accent line and section headers. Footer with product/version/date and page numbers.

### Diff PDF

Three separate color-coded tables — Added (green), Changed (amber, side-by-side old vs new), Removed (red). Empty tables are skipped. The summary paragraph leads the document. Filename: `fortigate-cli-diff-<from>-to-<to>.pdf`.

### Truncation recovery

If the model hits `max_tokens` mid-array, FortiCLI walks the partial JSON backwards, finds the last cleanly-closed element, and balances the open brackets to recover everything up to that point. You'll see a "response clipped" banner so you know to regenerate if you want more.

### Fortinet docs links

Both tabs show a **Fortinet documentation** panel that updates live as you type a version. Links go to:
- `docs.fortinet.com/product/<slug>/<version>` (product hub)
- `/document/<slug>/<version>/cli-reference`
- `/document/<slug>/<version>/administration-guide`
- `/document/<slug>/<version>/fortios-release-notes`
- `/document/<slug>/<version>/new-features` (diff "to" version, cheat sheet)

Versions like `7.4.x` are auto-normalized to `7.4` (the docs site resolves that to the latest 7.4 release).

---

## Project structure

```
forticli/
├── public/
│   └── favicon.svg               Fortinet-red ">_" icon
├── src/
│   ├── App.jsx                   Top bar, API-key gate, Settings dialog, footer
│   ├── FortiCLI.jsx              Both tabs, prompts, PDF/TXT exports, helpers
│   ├── api.js                    Direct browser fetch to api.anthropic.com
│   ├── config.js                 Model list, storage keys, brand color
│   ├── theme.js                  Colors, fonts, base CSS
│   └── main.jsx                  React entry point
├── index.html
├── vite.config.js                base: './' so it works under any subpath
├── package.json
├── LICENSE                       MIT
└── README.md
```

No backend folder. There is no backend.

---

## Customizing / extending

### Add a new Fortinet product

In `src/FortiCLI.jsx`:

```js
const PRODUCTS = [..., "FortiNewProduct"];

const PRODUCT_CATS = {
  ...,
  "FortiNewProduct": ["System & Admin", "Feature A", "Feature B", "Debugging"],
};

const PRODUCT_VERS = {
  ...,
  "FortiNewProduct": ["2.0.1", "1.5.3"],
};

const PRODUCT_DOC_SLUG = {
  ...,
  "FortiNewProduct": "fortinewproduct",
};
```

### Add a new model

Edit `src/config.js`:

```js
export const MODEL_OPTIONS = [
  ...,
  { id: 'claude-opus-5-some-future-snapshot', label: 'Future Opus' },
];
```

### Tweak the prompts

In `src/FortiCLI.jsx`, find `CHEAT_SYSTEM`, `DIFF_SYSTEM`, `buildCheatPrompt`, `buildDiffPrompt`. The JSON output shape is documented inline in each.

### Theme it differently

`src/theme.js` exports a flat `theme` object with named colors. Change `accent` to swap the Fortinet red for your brand. The favicon (`public/favicon.svg`) is the only other place the red lives.

---

## Troubleshooting

### "Invalid API key"
You either pasted it wrong, the key was revoked, or your Anthropic account ran out of credits. Open Settings, paste a fresh key, and try again.

### "Network error reaching api.anthropic.com"
- Check your internet connection
- Some corporate networks block `api.anthropic.com` — try a personal connection
- A browser extension (ad blocker, privacy guard) may be blocking the call — disable for this site

### "JSON.parse: end of data..." or "Model response was malformed or truncated"
The model hit `max_tokens` and the recovery couldn't repair it. Regenerate with fewer categories selected, or switch to a model with a larger output budget.

### Response is clipped (amber banner)
You hit `max_tokens`. Same fix as above. The data shown is everything that was successfully recovered.

### Anthropic rate-limited me
Either upgrade your account tier or wait — Anthropic's rate limits reset on a sliding window.

### Build succeeds but the page is blank when opened directly from `dist/index.html` (file://)
Modern browsers block module loading from `file://`. Use `npm run preview` or any static file server (`python -m http.server`, `npx serve dist`, etc.).

### Cheat sheet for an obscure firmware is hallucinating syntax
This is the fundamental limitation of LLM-generated CLI. The model is great for common patterns and recent FortiOS releases; rare or very-old syntax can be wrong. **Always validate against the linked Fortinet CLI Reference before applying to a production gate.** The Fortinet docs panel in the UI links you straight there.

---

## Limitations & honest caveats

- **Output is AI-generated.** It will occasionally be wrong, especially for niche commands, deprecated syntax, or new features the model wasn't trained on. The closer your firmware version is to mainstream and recent, the better the quality.
- **No live validation.** FortiCLI does not run the CLI against a real device. Think of it as a starting point and a study aid, not authoritative documentation.
- **No persistence beyond your browser.** Cheat sheets and diffs are not saved between sessions (except in your downloaded PDFs/TXTs). This is intentional.
- **Token costs accrue per generation.** Each click of Generate spends money against your Anthropic account.
- **The browser-direct-call pattern is appropriate for personal tools.** Don't deploy a public version where you handle other users' keys — every user pastes their own.

---

## Contributing

Issues and PRs welcome — especially:

- Better default category/version metadata for products that aren't FortiGate
- Print stylesheets that look great on a single page
- Localization
- Additional Fortinet products (FortiClient, FortiEDR, FortiSIEM, FortiVoice, etc.)
- A "saved cheat sheets" sidebar with IndexedDB

Code style: vanilla React 18, no TypeScript, inline styles from `theme.js`. Single-file components are fine. No unnecessary abstractions.

---

## License

[MIT](./LICENSE) — do whatever you want, no warranty, attribution appreciated but not required.

---

**FortiCLI** · Built independently by [Tanner Harrison](https://tannerharrison.com) · [github.com/tannerharris0n/forticli](https://github.com/tannerharris0n/forticli) · Not a Fortinet GitHub account · Not affiliated with, endorsed by, or supported by Fortinet, Inc.
