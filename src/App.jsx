import { useState, useEffect } from 'react';
import FortiCLI from './FortiCLI';
import { theme as T, fonts, baseStyles } from './theme';
import { getApiKey, setApiKey, getModel, setModel } from './api';
import { MODEL_OPTIONS, DEFAULT_MODEL } from './config';

export default function App() {
  const [hasKey, setHasKey] = useState(() => Boolean(getApiKey()));
  const [showSettings, setShowSettings] = useState(false);

  // Open settings automatically if a request bubbled NO_API_KEY.
  const requestKey = () => setShowSettings(true);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: fonts.body, color: T.text }}>
      <style>{baseStyles}</style>

      <TopBar onOpenSettings={() => setShowSettings(true)} />

      {!hasKey ? (
        <Onboarding onSaved={() => { setHasKey(true); }} />
      ) : (
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px 64px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: T.text, margin: '0 0 6px', letterSpacing: '-0.3px' }}>
              FortiCLI Reference
            </h1>
            <p style={{ fontSize: '14.5px', color: T.textDim, margin: 0, lineHeight: '1.55' }}>
              AI-generated Fortinet CLI cheat sheets and FortiOS version diffs. Bring your own Anthropic API key.
            </p>
          </div>
          <FortiCLI onNeedApiKey={requestKey} />
        </div>
      )}

      {showSettings && (
        <SettingsDialog
          onClose={() => setShowSettings(false)}
          onSaved={() => { setHasKey(Boolean(getApiKey())); setShowSettings(false); }}
        />
      )}

      <Footer />
    </div>
  );
}

function TopBar({ onOpenSettings }) {
  return (
    <div style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      padding: '0 24px', height: '58px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', background: T.accent,
          borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: fonts.mono, fontSize: '14px', fontWeight: '700',
        }}>&gt;_</div>
        <span style={{ fontSize: '17px', fontWeight: '700', color: T.text, letterSpacing: '-0.3px' }}>
          FortiCLI
        </span>
        <span style={{ fontSize: '11px', color: T.textFaint, fontFamily: fonts.mono, letterSpacing: '0.4px', marginLeft: '6px', textTransform: 'uppercase' }}>
          BYOK
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a href="https://github.com/tannerharris0n/forticli" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '13px', color: T.textDim, padding: '7px 12px', borderRadius: '7px' }}>
          GitHub ↗
        </a>
        <button onClick={onOpenSettings} style={{
          background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.text,
          padding: '7px 14px', fontSize: '13px', fontFamily: fonts.body, borderRadius: '8px',
          cursor: 'pointer', fontWeight: '500',
        }}>Settings</button>
      </div>
    </div>
  );
}

function Onboarding({ onSaved }) {
  const [key, setKey] = useState('');
  const [model, setModelLocal] = useState(DEFAULT_MODEL);
  const [err, setErr] = useState('');

  const save = () => {
    const trimmed = key.trim();
    if (!trimmed) { setErr('Paste your Anthropic API key to continue.'); return; }
    if (!/^sk-/.test(trimmed)) { setErr('That does not look like an Anthropic key — they start with "sk-".'); return; }
    setApiKey(trimmed);
    setModel(model);
    onSaved();
  };

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '64px 24px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔑</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: T.text, margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          Welcome to FortiCLI
        </h2>
        <p style={{ fontSize: '14.5px', color: T.textDim, margin: 0, lineHeight: '1.6' }}>
          FortiCLI is a static-only app — you bring your own Anthropic API key, and all calls go directly from your browser to api.anthropic.com. Your key never leaves your machine.
        </p>
      </div>

      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: '14px', padding: '28px', marginBottom: '20px',
      }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '8px' }}>
          Anthropic API key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => { setKey(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="sk-ant-…"
          autoFocus
          style={{
            width: '100%', padding: '13px 15px', background: T.bg,
            border: `1px solid ${err ? T.red : T.border}`, borderRadius: '10px',
            color: T.text, fontSize: '14px', fontFamily: fonts.mono, marginBottom: '14px',
          }}
        />

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '8px' }}>
          Model
        </label>
        <select value={model} onChange={e => setModelLocal(e.target.value)} style={{
          width: '100%', padding: '12px 14px', background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: '10px',
          color: T.text, fontSize: '14px', fontFamily: fonts.body, marginBottom: '14px',
        }}>
          {MODEL_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>

        {err && (
          <div style={{ color: T.red, fontSize: '13px', marginBottom: '12px' }}>{err}</div>
        )}

        <button onClick={save} disabled={!key.trim()} style={{
          width: '100%', padding: '14px', background: key.trim() ? T.accent : T.surfaceAlt,
          color: key.trim() ? T.textInverse : T.textFaint,
          border: 'none', borderRadius: '10px',
          fontSize: '15px', fontWeight: '600', fontFamily: fonts.body,
          cursor: key.trim() ? 'pointer' : 'not-allowed',
        }}>Save &amp; start</button>
      </div>

      <div style={{
        fontSize: '13px', color: T.textDim, lineHeight: '1.65',
        padding: '18px 22px', background: T.surfaceAlt,
        border: `1px solid ${T.border}`, borderRadius: '12px',
      }}>
        <div style={{ fontWeight: '600', color: T.text, marginBottom: '8px' }}>Where do I get a key?</div>
        Sign in at{' '}
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" style={{ color: T.accent, fontWeight: '500' }}>
          console.anthropic.com/settings/keys
        </a>{' '}
        and create one. You'll need a billed Anthropic account — usage is metered per token.
        <div style={{ marginTop: '10px', fontSize: '12.5px', color: T.textFaint }}>
          Your key is stored in <code style={{ fontFamily: fonts.mono, background: T.surface, padding: '1px 5px', borderRadius: '4px' }}>localStorage</code> on this device only. Clearing browser data removes it.
        </div>
      </div>
    </div>
  );
}

function SettingsDialog({ onClose, onSaved }) {
  const [key, setKey] = useState(getApiKey());
  const [model, setModelLocal] = useState(getModel());

  // Lock body scroll while dialog is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const save = () => {
    setApiKey(key.trim());
    setModel(model);
    onSaved();
  };

  const clearKey = () => {
    if (!confirm('Remove the saved API key from this browser?')) return;
    setApiKey('');
    setKey('');
    onSaved();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', zIndex: 100,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.surface, borderRadius: '14px',
        padding: '28px', width: '100%', maxWidth: '480px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: T.text, margin: 0 }}>Settings</h3>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: T.textDim,
            fontSize: '22px', cursor: 'pointer', padding: 0, lineHeight: 1,
          }}>×</button>
        </div>

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '8px' }}>
          Anthropic API key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-…"
          style={{
            width: '100%', padding: '12px 14px', background: T.bg,
            border: `1px solid ${T.border}`, borderRadius: '10px',
            color: T.text, fontSize: '14px', fontFamily: fonts.mono, marginBottom: '16px',
          }}
        />

        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '8px' }}>
          Model
        </label>
        <select value={model} onChange={e => setModelLocal(e.target.value)} style={{
          width: '100%', padding: '11px 14px', background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: '10px',
          color: T.text, fontSize: '14px', fontFamily: fonts.body, marginBottom: '20px',
        }}>
          {MODEL_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={save} style={{
            flex: 1, padding: '12px', background: T.accent, color: T.textInverse,
            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
            fontFamily: fonts.body, cursor: 'pointer',
          }}>Save</button>
          <button onClick={clearKey} style={{
            padding: '12px 16px', background: T.surface, color: T.red,
            border: `1px solid ${T.redBorder}`, borderRadius: '10px',
            fontSize: '14px', fontWeight: '500', fontFamily: fonts.body, cursor: 'pointer',
          }}>Clear key</button>
        </div>

        <div style={{
          fontSize: '12px', color: T.textFaint, marginTop: '18px',
          lineHeight: '1.55',
        }}>
          Your key lives in this browser's <code style={{ fontFamily: fonts.mono }}>localStorage</code>. It's never sent to any server other than api.anthropic.com.
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      borderTop: `1px solid ${T.border}`, padding: '20px 24px',
      fontSize: '12px', color: T.textFaint, textAlign: 'center',
      fontFamily: fonts.body,
    }}>
      Open source ·{' '}
      <a href="https://github.com/tannerharris0n/forticli" target="_blank" rel="noopener noreferrer" style={{ color: T.textDim }}>
        github.com/tannerharris0n/forticli
      </a>{' '}· Not affiliated with Fortinet, Inc.
    </div>
  );
}
