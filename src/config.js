// Default model. Override via the settings panel (model picker) or by editing
// this constant. Any valid Anthropic model ID works. As of late 2025 / 2026:
//   claude-opus-4-7
//   claude-sonnet-4-6   ← recommended default
//   claude-sonnet-4-5
//   claude-haiku-4-5-20251001
export const DEFAULT_MODEL = 'claude-sonnet-4-5';

export const MODEL_OPTIONS = [
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (recommended)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-7', label: 'Claude Opus 4.7 (best quality, slower)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fastest, cheapest)' },
];

export const STORAGE_KEY_API = 'forticli:anthropic_api_key';
export const STORAGE_KEY_MODEL = 'forticli:model';

export const FORTI_RED = '#DA291C';
