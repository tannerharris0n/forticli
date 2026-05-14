export const theme = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F3F0',
  hover: '#F0EFEC',

  border: '#E4E2DD',
  borderHover: '#D0CDC6',
  borderActive: '#1A1A1A',

  text: '#1A1A1A',
  textBody: '#3D3D3D',
  textDim: '#6B6B6B',
  textFaint: '#9B9B9B',
  textInverse: '#FFFFFF',

  accent: '#DA291C',
  accentDim: 'rgba(218,41,28,0.06)',
  accentBorder: 'rgba(218,41,28,0.22)',

  green: '#166534',
  greenDim: 'rgba(22,101,52,0.07)',
  greenBorder: 'rgba(22,101,52,0.22)',

  amber: '#92400e',
  amberDim: 'rgba(146,64,14,0.07)',
  amberBorder: 'rgba(146,64,14,0.22)',

  red: '#991B1B',
  redDim: 'rgba(153,27,27,0.07)',
  redBorder: 'rgba(153,27,27,0.22)',

  info: '#1d4ed8',
  infoDim: 'rgba(29,78,216,0.07)',
  infoBorder: 'rgba(29,78,216,0.22)',
};

export const fonts = {
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'DM Mono', 'Menlo', monospace",
};

export const fontImport = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');`;

export const keyframes = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
`;

export const baseStyles = `
  ${fontImport}
  ${keyframes}
  * { box-sizing: border-box; margin: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: ${fonts.body}; -webkit-font-smoothing: antialiased; }
  input:focus, textarea:focus, select:focus { border-color: ${theme.accent} !important; box-shadow: 0 0 0 3px ${theme.accentDim}; outline: none; }
  ::selection { background: ${theme.accentDim}; color: ${theme.text}; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
  a { text-decoration: none; color: inherit; }
`;
