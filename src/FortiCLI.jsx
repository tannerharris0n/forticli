// FortiCLI Reference — standalone, BYOK, static-only.
// AI-generated CLI cheat sheets and FortiOS version diffs with PDF export.

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { callClaude } from './api';
import { theme as T, fonts } from './theme';
import { FORTI_RED } from './config';

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const PRODUCTS = ["FortiGate","FortiSwitch","FortiAP","FortiAnalyzer","FortiManager","FortiAuthenticator","FortiDeceptor","FortiNAC","FortiProxy"];

const PRODUCT_CATS = {
  "FortiGate": ["System & Admin","Routing & BGP","IPsec VPN","SSL-VPN","SD-WAN","High Availability","Firewall Policies","NAT","Certificates & PKI","VDOM","Logging & Diagnostics","FortiGuard","Wireless Controller","Debugging"],
  "FortiSwitch": ["System & Admin","VLANs","STP/RSTP","Link Aggregation","Port Config","ACLs","LLDP/CDP","Debugging"],
  "FortiAP": ["System & Admin","WiFi Profiles","Radio Config","Rogue AP Detection","Client Management","Debugging"],
  "FortiAnalyzer": ["System & Admin","Log Management","Reports","ADOM Management","Fabric Integration","Debugging"],
  "FortiManager": ["System & Admin","Device Management","Policy Packages","ADOM Management","SD-WAN Templates","Debugging"],
  "FortiAuthenticator": ["System & Admin","RADIUS","LDAP/AD","Certificates","FortiToken/TOTP","Debugging"],
  "FortiDeceptor": ["System & Admin","Decoy Configuration","Alert Management","Fabric Integration","Debugging"],
  "FortiNAC": ["System & Admin","Network Access Control","Device Profiling","Policy Management","Debugging"],
  "FortiProxy": ["System & Admin","Proxy Policies","Web Filtering","SSL Inspection","Authentication","Debugging"],
};

const PRODUCT_VERS = {
  "FortiGate": ["7.6.1","7.4.4","7.4.3","7.2.9","7.0.15","6.4.15"],
  "FortiSwitch": ["7.4.3","7.2.7","7.0.8","6.4.6"],
  "FortiAP": ["7.4.3","7.2.6","7.0.5"],
  "FortiAnalyzer": ["7.6.1","7.4.3","7.2.7","7.0.8"],
  "FortiManager": ["7.6.1","7.4.3","7.2.7","7.0.8"],
  "FortiAuthenticator": ["7.0.2","6.6.1","6.4.3"],
  "FortiDeceptor": ["6.0.2","5.3.1"],
  "FortiNAC": ["10.3.5","9.4.7"],
  "FortiProxy": ["7.4.3","7.2.8","7.0.12"],
};

const FGT_DIFF_VERS = ["7.6.x","7.4.x","7.2.x","7.0.x","6.4.x","6.2.x"];

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
function extractText(res) {
  return (res?.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
}

function parseJSON(text) {
  let s = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const f = s.indexOf('{');
  if (f > 0) s = s.slice(f);
  try { return JSON.parse(s); } catch {}
  const l = s.lastIndexOf('}');
  if (l > 0) {
    try { return JSON.parse(s.slice(0, l + 1)); } catch {}
  }
  return parseTruncatedJSON(s);
}

function parseTruncatedJSON(input) {
  let s = input;
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    if (ch !== '}' && ch !== ']') continue;
    const candidate = s.slice(0, i + 1);
    const balanced = balanceBrackets(candidate);
    if (balanced !== null) {
      try { return JSON.parse(balanced); } catch {}
    }
  }
  throw new Error('Model response was malformed or truncated. Try regenerating.');
}

function balanceBrackets(input) {
  const stack = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === '"') { inStr = false; }
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[') stack.push(c);
    else if (c === '}' || c === ']') stack.pop();
  }
  if (inStr) return null;
  let trimmed = input.replace(/,\s*$/, '');
  while (stack.length) {
    const open = stack.pop();
    trimmed += open === '{' ? '}' : ']';
  }
  return trimmed;
}

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function todayStr() {
  const d = new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

// ─── Fortinet docs URL builder ───
const PRODUCT_DOC_SLUG = {
  "FortiGate": "fortigate",
  "FortiSwitch": "fortiswitch",
  "FortiAP": "fortiap",
  "FortiAnalyzer": "fortianalyzer",
  "FortiManager": "fortimanager",
  "FortiAuthenticator": "fortiauthenticator",
  "FortiDeceptor": "fortideceptor",
  "FortiNAC": "fortinac-f",
  "FortiProxy": "fortiproxy",
};

function normalizeDocVersion(v) {
  return String(v || '').trim().replace(/\.x$/i, '');
}

function fortiDocs(product, version) {
  const slug = PRODUCT_DOC_SLUG[product] || String(product || '').toLowerCase();
  const v = normalizeDocVersion(version);
  if (!slug || !v) return null;
  return {
    productHub: `https://docs.fortinet.com/product/${slug}/${v}`,
    cliReference: `https://docs.fortinet.com/document/${slug}/${v}/cli-reference`,
    adminGuide: `https://docs.fortinet.com/document/${slug}/${v}/administration-guide`,
    releaseNotes: `https://docs.fortinet.com/document/${slug}/${v}/fortios-release-notes`,
    newFeatures: `https://docs.fortinet.com/document/${slug}/${v}/new-features`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════
const CHEAT_SYSTEM = `You are a senior Fortinet network security engineer. Return ONLY valid JSON, no markdown fences, no preamble. Use real CLI syntax.`;

function buildCheatPrompt(product, version, categories) {
  return `Generate a CLI cheat sheet for ${product} firmware ${version}.

Categories to cover: ${categories.join(', ')}

Return JSON in this exact shape:
{
  "product": "${product}",
  "version": "${version}",
  "sections": [
    {
      "name": "category name",
      "commands": [
        { "description": "short, action-oriented", "command": "exact CLI syntax including 'config ... end' blocks where appropriate", "notes": "optional context, caveats, or gotchas" }
      ]
    }
  ]
}

Rules:
- 6 to 10 commands per section.
- One section per requested category, in the order given.
- Use real, copy-pasteable CLI. Show full config blocks for set/edit/next/end where it matters.
- Multi-line commands: use \\n inside the JSON string.
- Notes field is optional — only include when there is a real caveat or gotcha. Omit otherwise.
- No commentary outside the JSON.`;
}

const DIFF_SYSTEM = `You are a senior Fortinet network security engineer with deep knowledge of FortiOS release-to-release CLI changes across the entire CLI surface (system, routing, VPN, SD-WAN, HA, firewall, NAT, certificates, VDOM, logging, FortiGuard, wireless, debugging, and more). Return ONLY valid JSON, no markdown fences, no preamble. Use real CLI syntax.`;

function buildDiffPrompt(versionA, versionB) {
  return `Compare the FortiGate CLI between FortiOS ${versionA} and ${versionB}, covering ALL areas of the CLI. Do not restrict to a single topic.

Return JSON in this exact shape:
{
  "version_a": "${versionA}",
  "version_b": "${versionB}",
  "added": [ { "area": "functional area, e.g. SD-WAN", "command": "new CLI in ${versionB}", "description": "what it does" } ],
  "removed": [ { "area": "functional area", "command": "CLI that existed in ${versionA} but not ${versionB}", "description": "what it did" } ],
  "changed": [ { "area": "functional area", "old_command": "syntax in ${versionA}", "new_command": "syntax in ${versionB}", "description": "what changed and why it matters" } ],
  "notes": "2-4 sentence executive summary of the most important shifts between these releases across the whole CLI"
}

Rules:
- Prioritize the most operationally significant changes a network engineer would hit in production. Target 6-10 entries per category — quality over quantity.
- Spread coverage across at least 4 different functional areas. Use the "area" field for grouping.
- Be specific. Cite real syntax, not vague descriptions. Keep descriptions to one short sentence.
- Multi-line CLI: use \\n. Keep each command block compact — show enough to be useful, not a full essay.
- If a category is empty (e.g. no removals), return an empty array.
- No commentary outside the JSON.`;
}

// ═══════════════════════════════════════════════════════════════════
// PDF EXPORT — CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════
function exportCheatSheetPDF(sheet) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const date = todayStr();
  const fortiRGB = hexToRgb(FORTI_RED);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(`${sheet.product} CLI Reference`, margin, margin + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Firmware v${sheet.version}  ·  Generated ${date}`, margin, margin + 30);

  doc.setDrawColor(...fortiRGB);
  doc.setLineWidth(2);
  doc.line(margin, margin + 42, pageW - margin, margin + 42);

  let cursorY = margin + 60;

  (sheet.sections || []).forEach((section, idx) => {
    if (cursorY > pageH - 120) { doc.addPage(); cursorY = margin; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...fortiRGB);
    doc.text(section.name, margin, cursorY);
    cursorY += 8;

    const rows = (section.commands || []).map(c => [c.description || '', c.command || '', c.notes || '']);

    autoTable(doc, {
      startY: cursorY + 4,
      head: [['Description', 'Command', 'Notes']],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, valign: 'top', overflow: 'linebreak', lineColor: [228, 226, 221], lineWidth: 0.4 },
      headStyles: { fillColor: [26, 26, 26], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [248, 247, 244] },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: 'italic', textColor: [90, 90, 90] },
        1: { cellWidth: 270, font: 'courier', fontStyle: 'bold', fontSize: 8, textColor: [20, 20, 20] },
        2: { cellWidth: 'auto', textColor: [110, 110, 110], fontSize: 8 },
      },
      didDrawPage: () => {
        const fy = pageH - 22;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(`FortiCLI Reference — ${sheet.product} v${sheet.version} — Generated ${date}`, margin, fy);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageW - margin, fy, { align: 'right' });
      },
    });

    cursorY = doc.lastAutoTable.finalY + 24;
    if (idx < sheet.sections.length - 1 && cursorY > pageH - 100) { doc.addPage(); cursorY = margin; }
  });

  doc.save(`${slugify(sheet.product)}-cli-v${sheet.version}-cheatsheet.pdf`);
}

// ═══════════════════════════════════════════════════════════════════
// PDF EXPORT — DIFF
// ═══════════════════════════════════════════════════════════════════
function exportDiffPDF(diff) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const date = todayStr();
  const fortiRGB = hexToRgb(FORTI_RED);
  const vA = diff.version_a || '';
  const vB = diff.version_b || '';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(`FortiOS CLI Diff`, margin, margin + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`${vA}  →  ${vB}   ·   Generated ${date}`, margin, margin + 30);

  doc.setDrawColor(...fortiRGB);
  doc.setLineWidth(2);
  doc.line(margin, margin + 42, pageW - margin, margin + 42);

  let cursorY = margin + 60;

  if (diff.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary', margin, cursorY);
    cursorY += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(diff.notes, pageW - margin * 2);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 12 + 16;
  }

  const drawFooter = () => {
    const fy = pageH - 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`FortiOS CLI Diff — ${vA} → ${vB}`, margin, fy);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageW - margin, fy, { align: 'right' });
  };

  if (Array.isArray(diff.added) && diff.added.length > 0) {
    if (cursorY > pageH - 120) { doc.addPage(); cursorY = margin; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.text(`Added in ${vB}`, margin, cursorY);
    autoTable(doc, {
      startY: cursorY + 8,
      head: [['Area', 'Command', 'Description']],
      body: diff.added.map(a => [a.area || '', a.command || '', a.description || '']),
      margin: { left: margin, right: margin },
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: [22, 101, 52], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [240, 248, 240] },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: 'bold', textColor: [60, 60, 60], fontSize: 8 },
        1: { cellWidth: 240, font: 'courier', fontStyle: 'bold', fontSize: 8, textColor: [20, 20, 20] },
        2: { cellWidth: 'auto' },
      },
      didDrawPage: drawFooter,
    });
    cursorY = doc.lastAutoTable.finalY + 24;
  }

  if (Array.isArray(diff.changed) && diff.changed.length > 0) {
    if (cursorY > pageH - 120) { doc.addPage(); cursorY = margin; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(146, 64, 14);
    doc.text(`Changed between ${vA} and ${vB}`, margin, cursorY);
    autoTable(doc, {
      startY: cursorY + 8,
      head: [['Area', `${vA} Command`, `${vB} Command`, 'What Changed']],
      body: diff.changed.map(c => [c.area || '', c.old_command || '', c.new_command || '', c.description || '']),
      margin: { left: margin, right: margin },
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 5, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: [146, 64, 14], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [252, 245, 235] },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [60, 60, 60], fontSize: 8 },
        1: { cellWidth: 150, font: 'courier', fontStyle: 'bold', fontSize: 7.5, textColor: [20, 20, 20] },
        2: { cellWidth: 150, font: 'courier', fontStyle: 'bold', fontSize: 7.5, textColor: [20, 20, 20] },
        3: { cellWidth: 'auto' },
      },
      didDrawPage: drawFooter,
    });
    cursorY = doc.lastAutoTable.finalY + 24;
  }

  if (Array.isArray(diff.removed) && diff.removed.length > 0) {
    if (cursorY > pageH - 120) { doc.addPage(); cursorY = margin; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(153, 27, 27);
    doc.text(`Removed in ${vB}`, margin, cursorY);
    autoTable(doc, {
      startY: cursorY + 8,
      head: [['Area', 'Command', 'Description']],
      body: diff.removed.map(r => [r.area || '', r.command || '', r.description || '']),
      margin: { left: margin, right: margin },
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, valign: 'top', overflow: 'linebreak' },
      headStyles: { fillColor: [153, 27, 27], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [252, 240, 240] },
      columnStyles: {
        0: { cellWidth: 90, fontStyle: 'bold', textColor: [60, 60, 60], fontSize: 8 },
        1: { cellWidth: 240, font: 'courier', fontStyle: 'bold', fontSize: 8, textColor: [20, 20, 20] },
        2: { cellWidth: 'auto' },
      },
      didDrawPage: drawFooter,
    });
  }

  doc.save(`fortigate-cli-diff-${slugify(vA)}-to-${slugify(vB)}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════
// TXT EXPORT
// ═══════════════════════════════════════════════════════════════════
function exportCheatSheetTxt(sheet) {
  const lines = [];
  lines.push(`${sheet.product} CLI Reference — Firmware v${sheet.version}`);
  lines.push(`Generated ${todayStr()}`);
  lines.push('');
  (sheet.sections || []).forEach(sec => {
    lines.push(`## ${sec.name}`);
    lines.push('');
    (sec.commands || []).forEach(cmd => {
      lines.push(`# ${cmd.description}`);
      lines.push(cmd.command);
      if (cmd.notes) lines.push(`# note: ${cmd.notes}`);
      lines.push('');
    });
    lines.push('');
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(sheet.product)}-cli-v${sheet.version}-cheatsheet.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════════
function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 13px', borderRadius: '999px', fontSize: '12.5px', fontWeight: '500',
      fontFamily: fonts.body, cursor: 'pointer', transition: 'all 0.15s',
      border: `1px solid ${active ? T.accent : T.border}`,
      background: active ? T.accentDim : T.surface,
      color: active ? T.accent : T.textBody,
    }}>{children}</button>
  );
}

function Label({ children }) {
  return <label style={{ fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '10px', display: 'block' }}>{children}</label>;
}

function CopyButton({ text, small }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <button type="button" onClick={copy} style={{
      padding: small ? '4px 9px' : '6px 12px',
      fontSize: small ? '11px' : '12px', fontWeight: '500', fontFamily: fonts.body,
      background: copied ? T.greenDim : T.surfaceAlt,
      color: copied ? T.green : T.textDim,
      border: `1px solid ${copied ? T.greenBorder : T.border}`,
      borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{copied ? 'Copied' : 'Copy'}</button>
  );
}

function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '13px 24px', background: disabled ? T.surfaceAlt : T.accent,
      color: disabled ? T.textFaint : T.textInverse,
      border: 'none', borderRadius: '10px',
      fontSize: '15px', fontWeight: '600', fontFamily: fonts.body,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>{children}</button>
  );
}

function SecondaryButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 14px', background: T.surface, color: T.text,
      border: `1px solid ${T.border}`, borderRadius: '8px',
      fontSize: '13px', fontWeight: '500', fontFamily: fonts.body, cursor: 'pointer',
    }}>{children}</button>
  );
}

function DocLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      fontSize: '12.5px', color: T.accent, fontWeight: '500',
      padding: '4px 10px', background: 'rgba(255,255,255,0.7)',
      border: `1px solid ${T.accentBorder}`, borderRadius: '6px',
      textDecoration: 'none', whiteSpace: 'nowrap',
    }}>{children} ↗</a>
  );
}

function DocsPanel({ entries }) {
  const valid = entries.filter(e => e && e.docs);
  if (valid.length === 0) return null;
  return (
    <div style={{
      background: T.accentDim, border: `1px solid ${T.accentBorder}`,
      borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
    }}>
      <div style={{
        fontSize: '11px', fontWeight: '600', color: T.accent,
        letterSpacing: '0.5px', textTransform: 'uppercase',
        marginBottom: '10px', fontFamily: fonts.mono,
      }}>Fortinet documentation</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {valid.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: T.text, minWidth: '160px', fontFamily: fonts.mono }}>{e.label}</div>
            <DocLink href={e.docs.productHub}>Product hub</DocLink>
            <DocLink href={e.docs.cliReference}>CLI Reference</DocLink>
            <DocLink href={e.docs.adminGuide}>Admin Guide</DocLink>
            <DocLink href={e.docs.releaseNotes}>Release Notes</DocLink>
            {e.showNewFeatures && <DocLink href={e.docs.newFeatures}>What's New</DocLink>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHEAT SHEET TAB
// ═══════════════════════════════════════════════════════════════════
function CheatSheetTab({ onNeedApiKey }) {
  const [product, setProduct] = useState('FortiGate');
  const [version, setVersion] = useState(PRODUCT_VERS['FortiGate'][0]);
  const [selectedCats, setSelectedCats] = useState(() => new Set(PRODUCT_CATS['FortiGate']));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [truncated, setTruncated] = useState(false);

  const cats = PRODUCT_CATS[product] || [];

  const onProductChange = (p) => {
    setProduct(p);
    setVersion((PRODUCT_VERS[p] || [''])[0]);
    setSelectedCats(new Set(PRODUCT_CATS[p] || []));
    setSheet(null); setError(null);
  };

  const toggleCat = (c) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  };

  const selectAll = () => setSelectedCats(new Set(cats));
  const clearAll = () => setSelectedCats(new Set());

  const generate = async () => {
    if (loading || !product || !version.trim()) return;
    const chosen = selectedCats.size === 0 ? cats : cats.filter(c => selectedCats.has(c));
    if (chosen.length === 0) return;

    setLoading(true); setError(null); setSheet(null); setTruncated(false);
    try {
      const response = await callClaude({
        system: CHEAT_SYSTEM,
        messages: [{ role: 'user', content: buildCheatPrompt(product, version.trim(), chosen) }],
        max_tokens: 8000,
      });
      const wasTruncated = response?.stop_reason === 'max_tokens';
      const parsed = parseJSON(extractText(response));
      setSheet(parsed);
      setTruncated(wasTruncated);
    } catch (e) {
      if (e.message === 'NO_API_KEY') { onNeedApiKey(); return; }
      setError(e.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const versions = PRODUCT_VERS[product] || [];

  return (
    <div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <Label>Product</Label>
            <select value={product} onChange={e => onProductChange(e.target.value)} style={{
              width: '100%', padding: '12px 14px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: '10px',
              color: T.text, fontSize: '14px', fontFamily: fonts.body,
            }}>
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <Label>Firmware version</Label>
            <input type="text" list="forti-versions" value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="e.g. 7.4.4"
              style={{
                width: '100%', padding: '12px 14px', background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: '10px',
                color: T.text, fontSize: '14px', fontFamily: fonts.body,
              }} />
            <datalist id="forti-versions">
              {versions.map(v => <option key={v} value={v} />)}
            </datalist>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Label>Categories ({selectedCats.size} of {cats.length})</Label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={selectAll} style={{
                padding: '5px 10px', fontSize: '11px', fontFamily: fonts.body, fontWeight: '500',
                background: 'transparent', color: T.accent, border: `1px solid ${T.accentBorder}`,
                borderRadius: '6px', cursor: 'pointer',
              }}>Select all</button>
              <button type="button" onClick={clearAll} style={{
                padding: '5px 10px', fontSize: '11px', fontFamily: fonts.body, fontWeight: '500',
                background: 'transparent', color: T.textDim, border: `1px solid ${T.border}`,
                borderRadius: '6px', cursor: 'pointer',
              }}>Clear</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cats.map(c => <Chip key={c} active={selectedCats.has(c)} onClick={() => toggleCat(c)}>{c}</Chip>)}
          </div>
          <div style={{ fontSize: '11.5px', color: T.textFaint, marginTop: '10px', fontFamily: fonts.mono }}>
            Tip: 0 selected = generate all categories.
          </div>
        </div>

        <DocsPanel entries={[{ label: `${product} ${version.trim()}`, docs: fortiDocs(product, version), showNewFeatures: true }]} />

        {error && (
          <div style={{ color: T.red, fontSize: '13px', marginBottom: '14px', padding: '12px 14px', background: T.redDim, borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <PrimaryButton onClick={generate} disabled={loading || !version.trim()}>
          {loading ? 'Generating...' : 'Generate cheat sheet'}
        </PrimaryButton>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', color: T.textDim }}>
          <div style={{ width: '20px', height: '20px', border: `2px solid ${T.border}`, borderTop: `2px solid ${T.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '14px' }}>Generating CLI reference for {product} {version}…</span>
        </div>
      )}

      {sheet && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: T.text }}>{sheet.product} v{sheet.version}</div>
              <div style={{ fontSize: '13px', color: T.textDim, marginTop: '2px' }}>
                {(sheet.sections || []).length} sections, {(sheet.sections || []).reduce((n, s) => n + (s.commands?.length || 0), 0)} commands
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <SecondaryButton onClick={() => exportCheatSheetTxt(sheet)}>Export .txt</SecondaryButton>
              <SecondaryButton onClick={() => exportCheatSheetPDF(sheet)}>Export PDF</SecondaryButton>
            </div>
          </div>

          {truncated && (
            <div style={{
              fontSize: '12.5px', color: T.amber, marginBottom: '16px',
              padding: '10px 14px', background: T.amberDim, border: `1px solid ${T.amberBorder}`,
              borderRadius: '8px', lineHeight: '1.5',
            }}>
              <strong>Heads up:</strong> the model hit its token limit and the response was clipped. Results were recovered up to the last complete entry — regenerate with fewer categories if you need full coverage.
            </div>
          )}

          <CheatSheetPoster sheet={sheet} />
          <CheatSheetDetails sheet={sheet} />
        </div>
      )}
    </div>
  );
}

// Poster view — dense, scannable, multi-column. All sections visible at once.
// Designed to look like a pinned wall reference (Wireshark-cheat-sheet style).
function CheatSheetPoster({ sheet }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: '14px', padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      marginBottom: '32px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: '14px', marginBottom: '18px', borderBottom: `2px solid ${T.accent}`,
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: T.accent, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: fonts.mono, marginBottom: '4px' }}>
            Cheat Sheet
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: T.text, letterSpacing: '-0.2px' }}>
            {sheet.product} <span style={{ color: T.textDim, fontWeight: '500' }}>v{sheet.version}</span>
          </div>
        </div>
      </div>

      <div style={{ columns: '300px 3', columnGap: '22px' }}>
        {(sheet.sections || []).map((sec, i) => (
          <div key={i} style={{
            breakInside: 'avoid', pageBreakInside: 'avoid',
            display: 'inline-block', width: '100%',
            marginBottom: '18px',
          }}>
            <div style={{
              background: T.accent, color: T.textInverse,
              fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase',
              fontFamily: fonts.mono,
              padding: '7px 11px', borderRadius: '6px 6px 0 0',
            }}>
              {sec.name}
            </div>
            <div style={{
              border: `1px solid ${T.border}`, borderTop: 'none',
              borderRadius: '0 0 6px 6px', padding: '4px 0',
            }}>
              {(sec.commands || []).map((cmd, j) => (
                <PosterCommand key={j} cmd={cmd} last={j === sec.commands.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PosterCommand({ cmd, last }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(cmd.command); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };
  return (
    <div
      onClick={copy}
      title="Click to copy"
      style={{
        padding: '8px 11px',
        borderBottom: last ? 'none' : `1px solid ${T.border}`,
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        fontSize: '10.5px', color: T.textDim, marginBottom: '3px',
        lineHeight: '1.35', fontWeight: '500',
      }}>
        {cmd.description}
      </div>
      <pre style={{
        margin: 0, fontFamily: fonts.mono, fontSize: '11.5px',
        fontWeight: '600', color: T.text,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        lineHeight: '1.4',
      }}>{cmd.command}</pre>
      {copied && (
        <div style={{
          position: 'absolute', top: '6px', right: '8px',
          fontSize: '9.5px', fontWeight: '600', color: T.green,
          fontFamily: fonts.mono, letterSpacing: '0.3px',
        }}>COPIED</div>
      )}
    </div>
  );
}

// Details — full per-command view with notes and copy buttons. Lives below
// the poster so the at-a-glance cheat sheet stays uncluttered.
function CheatSheetDetails({ sheet }) {
  const sections = (sheet.sections || []).filter(s => (s.commands || []).length > 0);
  if (sections.length === 0) return null;

  return (
    <div>
      <div style={{
        fontSize: '11px', fontWeight: '600', color: T.textDim,
        letterSpacing: '1px', textTransform: 'uppercase',
        marginBottom: '14px', fontFamily: fonts.mono,
      }}>
        Details, notes &amp; copy
      </div>

      {sections.map((sec, i) => (
        <div key={i} style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: '12px', marginBottom: '14px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 18px', background: T.surfaceAlt,
            borderBottom: `1px solid ${T.border}`,
            fontSize: '13px', fontWeight: '600', color: T.text,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>{sec.name}</span>
            <span style={{ fontSize: '11px', color: T.textDim, fontFamily: fonts.mono, fontWeight: '500' }}>
              {(sec.commands || []).length} commands
            </span>
          </div>
          <div style={{ padding: '8px 18px 16px' }}>
            {(sec.commands || []).map((cmd, j) => (
              <div key={j} style={{
                padding: '12px 0',
                borderTop: j === 0 ? 'none' : `1px solid ${T.border}`,
              }}>
                <div style={{ fontSize: '13px', color: T.textBody, marginBottom: '8px', fontWeight: '500' }}>
                  {cmd.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <pre style={{
                    flex: 1, margin: 0, padding: '10px 12px',
                    background: T.surfaceAlt, border: `1px solid ${T.border}`,
                    borderRadius: '8px', fontFamily: fonts.mono, fontSize: '12.5px',
                    color: T.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    lineHeight: '1.55', overflow: 'auto',
                  }}>{cmd.command}</pre>
                  <CopyButton text={cmd.command} />
                </div>
                {cmd.notes && (
                  <div style={{ fontSize: '12px', color: T.textDim, marginTop: '8px', lineHeight: '1.5', paddingLeft: '4px' }}>
                    <span style={{ fontWeight: '600', color: T.textBody }}>Note: </span>{cmd.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DIFF TAB
// ═══════════════════════════════════════════════════════════════════
function DiffTab({ onNeedApiKey }) {
  const [fromVer, setFromVer] = useState(FGT_DIFF_VERS[1]);
  const [toVer, setToVer] = useState(FGT_DIFF_VERS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diff, setDiff] = useState(null);
  const [truncated, setTruncated] = useState(false);

  const generate = async () => {
    if (loading || !fromVer.trim() || !toVer.trim()) return;
    setLoading(true); setError(null); setDiff(null); setTruncated(false);
    try {
      const response = await callClaude({
        system: DIFF_SYSTEM,
        messages: [{ role: 'user', content: buildDiffPrompt(fromVer.trim(), toVer.trim()) }],
        max_tokens: 8000,
      });
      const wasTruncated = response?.stop_reason === 'max_tokens';
      const parsed = parseJSON(extractText(response));
      setDiff(parsed);
      setTruncated(wasTruncated);
    } catch (e) {
      if (e.message === 'NO_API_KEY') { onNeedApiKey(); return; }
      setError(e.message || 'Diff generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const docsEntries = [
    { label: `FortiGate ${fromVer.trim()}`, docs: fortiDocs('FortiGate', fromVer), showNewFeatures: false },
    { label: `FortiGate ${toVer.trim()}`, docs: fortiDocs('FortiGate', toVer), showNewFeatures: true },
  ];

  return (
    <div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <Label>From version</Label>
            <input type="text" list="diff-vers" value={fromVer}
              onChange={e => setFromVer(e.target.value)}
              placeholder="e.g. 7.2.x"
              style={{
                width: '100%', padding: '12px 14px', background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: '10px',
                color: T.text, fontSize: '14px', fontFamily: fonts.body,
              }} />
          </div>
          <div>
            <Label>To version</Label>
            <input type="text" list="diff-vers" value={toVer}
              onChange={e => setToVer(e.target.value)}
              placeholder="e.g. 7.4.x"
              style={{
                width: '100%', padding: '12px 14px', background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: '10px',
                color: T.text, fontSize: '14px', fontFamily: fonts.body,
              }} />
          </div>
        </div>
        <datalist id="diff-vers">
          {FGT_DIFF_VERS.map(v => <option key={v} value={v} />)}
        </datalist>

        <div style={{ fontSize: '12px', color: T.textDim, marginBottom: '16px', lineHeight: '1.55' }}>
          Generates a CLI diff across the entire FortiOS surface — system, routing, VPN, SD-WAN, HA, firewall, NAT, certificates, VDOM, logging, FortiGuard, wireless, debugging. Each entry is tagged with its functional area.
        </div>

        <DocsPanel entries={docsEntries} />

        {error && (
          <div style={{ color: T.red, fontSize: '13px', marginBottom: '14px', padding: '12px 14px', background: T.redDim, borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <PrimaryButton onClick={generate} disabled={loading || !fromVer.trim() || !toVer.trim()}>
          {loading ? 'Generating...' : 'Generate diff'}
        </PrimaryButton>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', color: T.textDim }}>
          <div style={{ width: '20px', height: '20px', border: `2px solid ${T.border}`, borderTop: `2px solid ${T.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '14px' }}>Comparing FortiOS {fromVer} → {toVer} across all CLI areas…</span>
        </div>
      )}

      {diff && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: T.text }}>FortiOS CLI Diff</div>
              <div style={{ fontSize: '13px', color: T.textDim, marginTop: '2px', fontFamily: fonts.mono }}>
                {diff.version_a} → {diff.version_b}
              </div>
            </div>
            <SecondaryButton onClick={() => exportDiffPDF(diff)}>Export PDF</SecondaryButton>
          </div>

          {truncated && (
            <div style={{
              fontSize: '12.5px', color: T.amber, marginBottom: '16px',
              padding: '10px 14px', background: T.amberDim, border: `1px solid ${T.amberBorder}`,
              borderRadius: '8px', lineHeight: '1.5',
            }}>
              <strong>Heads up:</strong> the model hit its token limit and the response was clipped. Results were recovered up to the last complete entry — regenerate if you need full coverage.
            </div>
          )}

          {diff.notes && (
            <div style={{
              background: T.accentDim, border: `1px solid ${T.accentBorder}`,
              borderRadius: '12px', padding: '16px 18px', marginBottom: '20px',
              fontSize: '14px', lineHeight: '1.65', color: T.text,
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: T.accent, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: fonts.mono }}>Summary</div>
              {diff.notes}
            </div>
          )}

          <DiffSection title={`Added in ${diff.version_b}`} color={T.green} dim={T.greenDim} border={T.greenBorder}
            count={(diff.added || []).length}>
            {(diff.added || []).map((a, i) => <DiffRow key={i} command={a.command} description={a.description} area={a.area} />)}
          </DiffSection>

          <DiffSection title={`Changed between ${diff.version_a} and ${diff.version_b}`}
            color={T.amber} dim={T.amberDim} border={T.amberBorder}
            count={(diff.changed || []).length}>
            {(diff.changed || []).map((c, i) => (
              <div key={i} style={{
                padding: '12px 14px', background: T.surfaceAlt,
                border: `1px solid ${T.border}`, borderRadius: '10px',
                marginBottom: '10px',
              }}>
                {c.area && <AreaBadge>{c.area}</AreaBadge>}
                {c.description && <div style={{ fontSize: '13px', color: T.textBody, marginBottom: '10px', fontWeight: '500' }}>{c.description}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: T.textDim, marginBottom: '4px', fontFamily: fonts.mono, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{diff.version_a}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <pre style={{
                        flex: 1, margin: 0, padding: '9px 11px',
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: '7px', fontFamily: fonts.mono, fontSize: '12px',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.text,
                      }}>{c.old_command}</pre>
                      <CopyButton text={c.old_command} small />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: T.textDim, marginBottom: '4px', fontFamily: fonts.mono, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{diff.version_b}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <pre style={{
                        flex: 1, margin: 0, padding: '9px 11px',
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: '7px', fontFamily: fonts.mono, fontSize: '12px',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.text,
                      }}>{c.new_command}</pre>
                      <CopyButton text={c.new_command} small />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </DiffSection>

          <DiffSection title={`Removed in ${diff.version_b}`} color={T.red} dim={T.redDim} border={T.redBorder}
            count={(diff.removed || []).length}>
            {(diff.removed || []).map((r, i) => <DiffRow key={i} command={r.command} description={r.description} area={r.area} />)}
          </DiffSection>
        </div>
      )}
    </div>
  );
}

function DiffSection({ title, color, dim, border, count, children }) {
  if (!count) return null;
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
        padding: '10px 14px', background: dim, border: `1px solid ${border}`, borderRadius: '10px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color }}>{title}</span>
        <span style={{
          fontSize: '11px', fontWeight: '600', color, fontFamily: fonts.mono,
          padding: '2px 8px', background: 'rgba(255,255,255,0.6)', borderRadius: '999px',
        }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function AreaBadge({ children }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '10.5px', fontWeight: '600',
      fontFamily: fonts.mono, letterSpacing: '0.4px', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: '999px',
      background: T.surface, border: `1px solid ${T.border}`, color: T.textDim,
      marginBottom: '8px',
    }}>{children}</span>
  );
}

function DiffRow({ command, description, area }) {
  return (
    <div style={{
      padding: '12px 14px', background: T.surfaceAlt,
      border: `1px solid ${T.border}`, borderRadius: '10px',
      marginBottom: '10px',
    }}>
      {area && <div><AreaBadge>{area}</AreaBadge></div>}
      {description && <div style={{ fontSize: '13px', color: T.textBody, marginBottom: '8px', fontWeight: '500' }}>{description}</div>}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <pre style={{
          flex: 1, margin: 0, padding: '10px 12px',
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: '7px', fontFamily: fonts.mono, fontSize: '12.5px',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.text,
        }}>{command}</pre>
        <CopyButton text={command} small />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════
export default function FortiCLI({ onNeedApiKey }) {
  const [tab, setTab] = useState('sheet');

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${T.border}`, marginBottom: '24px' }}>
        {[
          { id: 'sheet', label: 'CLI Cheat Sheet' },
          { id: 'diff', label: 'Version Diff' },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '11px 18px', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${active ? T.accent : 'transparent'}`,
              color: active ? T.accent : T.textDim,
              fontSize: '14px', fontWeight: active ? '600' : '500',
              fontFamily: fonts.body, cursor: 'pointer', marginBottom: '-1px',
            }}>{t.label}</button>
          );
        })}
      </div>

      {tab === 'sheet' && <CheatSheetTab onNeedApiKey={onNeedApiKey} />}
      {tab === 'diff' && <DiffTab onNeedApiKey={onNeedApiKey} />}
    </div>
  );
}
