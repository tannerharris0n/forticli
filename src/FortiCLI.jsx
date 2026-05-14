// FortiCLI Reference — standalone, BYOK, static-only.
// AI-generated CLI cheat sheets and FortiOS version diffs with PDF export.

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { callClaude } from './api';
import { theme as T, fonts } from './theme';
import { FORTI_RED } from './config';
import { loadVersions, FALLBACK_VERSIONS } from './versions';

// ═══════════════════════════════════════════════════════════════════
// LOADING PANEL — status messages + dad jokes (Fortinet/network flavored)
// ═══════════════════════════════════════════════════════════════════
const CHEAT_STATUSES = [
  'Asking Claude for the most useful commands...',
  'Cross-referencing Fortinet syntax for your firmware...',
  'Filling out each category...',
  'Polishing command examples...',
  'Adding caveats and gotchas...',
  'Laying it out poster-style...',
  'Almost there — wrapping it up...',
];

const DIFF_STATUSES = [
  'Asking Claude to compare FortiOS releases...',
  'Hunting down newly-added CLI...',
  'Tracking syntax changes between versions...',
  'Cataloging deprecated commands...',
  'Tagging each entry with its functional area...',
  'Drafting the executive summary...',
  'Almost there — wrapping it up...',
];

const DAD_JOKES = [
  "Why did the firewall go to therapy? It had too many trust issues.",
  "I told my router a joke. It didn't get it — must have been over its head.",
  "What did one firewall say to the other? \"I'd allow you, but I have a strict policy.\"",
  "Why was VLAN 1 always in trouble? It was always tagged.",
  "Why don't packets like the dark? There's no light at the end of the tunnel... mode.",
  "Why did the SSL certificate go to therapy? It had attachment issues.",
  "How does a firewall flirt? It sends ICMP echo requests.",
  "What's a network engineer's favorite drink? A LAN-ade.",
  "Why did the BGP route cross the road? To get to the other AS.",
  "I asked the router for directions. It said it'd get back to me in 30 seconds.",
  "Why do network engineers hate camping? Too many access points.",
  "Why was the SD-WAN smug? It said MPLS was \"so 2010.\"",
  "Why don't NAT rules work in elevators? They always translate up.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "Why don't scientists trust atoms? They make up everything.",
  "Why did the IPv6 packet feel left out? Nobody understood it.",
  "Why was the FortiGate so calm? Great policies.",
  "What did the SOC analyst order at the buffet? Phish and grits.",
  "Why did the switch break up with the hub? Too much collision.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why don't TCP packets fight? They reach an agreement with a handshake first.",
  "Why was the DNS server bad at small talk? It kept saying, \"let me ask someone else.\"",
  "Why did the network admin go broke? Too many subnets to pay off.",
  "What's a hacker's favorite snack? Cookies.",
  "I started a band called 1023MB. We still haven't gotten a gig.",
  "Why was the OSI model so patient? It had layers.",
  "Why did the FortiAnalyzer feel overwhelmed? Too many logs to chop.",
  "Why did the CLI command get mad? Someone disabled it without saving.",
  "What did the packet say after a long trip? \"I'm just glad to be on the right route.\"",
  "Why was the IPS so confident? It always saw it coming.",
  "Why did the certificate cross the road? It had a CA on the other side.",
  "What's a sysadmin's favorite kind of music? Heavy metal — they love a good drive.",
  "Why don't networks like surprises? They prefer scheduled maintenance.",
];

function LoadingPanel({ statusMessages, jokes }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [jokeIdx, setJokeIdx] = useState(() => Math.floor(Math.random() * jokes.length));
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => setElapsed(e => e + 1), 1000);
    const statusRot = setInterval(() => setStatusIdx(i => (i + 1) % statusMessages.length), 3500);
    const jokeRot = setInterval(() => setJokeIdx(i => (i + 1) % jokes.length), 7000);
    return () => { clearInterval(ticker); clearInterval(statusRot); clearInterval(jokeRot); };
  }, [statusMessages.length, jokes.length]);

  const nextJoke = () => setJokeIdx(i => (i + 1) % jokes.length);

  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: '14px', padding: '24px', marginBottom: '24px',
      animation: 'fadeIn 0.25s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '28px', height: '28px',
          border: `3px solid ${T.border}`, borderTop: `3px solid ${T.accent}`,
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: T.text, lineHeight: '1.4' }}>
            {statusMessages[statusIdx]}
          </div>
          <div style={{
            fontSize: '11.5px', color: T.textFaint, marginTop: '4px',
            fontFamily: fonts.mono, letterSpacing: '0.3px',
          }}>
            {elapsed}s elapsed
          </div>
        </div>
      </div>

      <div style={{
        padding: '16px 18px', background: T.surfaceAlt,
        border: `1px solid ${T.border}`, borderRadius: '12px',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <div style={{
            fontSize: '10.5px', fontWeight: '600', color: T.accent,
            letterSpacing: '0.7px', textTransform: 'uppercase', fontFamily: fonts.mono,
          }}>
            A dad joke while you wait
          </div>
          <button onClick={nextJoke} style={{
            fontSize: '11px', color: T.textDim, background: 'transparent',
            border: `1px solid ${T.border}`, padding: '3px 10px',
            borderRadius: '999px', cursor: 'pointer', fontFamily: fonts.mono,
            fontWeight: '500',
          }}>next ↻</button>
        </div>
        <div key={jokeIdx} style={{
          fontSize: '14.5px', color: T.text, lineHeight: '1.55',
          animation: 'fadeIn 0.3s ease', fontStyle: 'italic',
        }}>
          {jokes[jokeIdx]}
        </div>
      </div>
    </div>
  );
}

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

// Firmware version lists are loaded at runtime from versions.json — see
// src/versions.js. PRODUCT_VERS / FGT_DIFF_VERS used to live here; they now
// arrive as props (passed down from the root component via state).

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
  return `Generate a tight, scannable CLI cheat sheet for ${product} firmware ${version}.

Categories to cover: ${categories.join(', ')}

Return JSON in this exact shape:
{
  "product": "${product}",
  "version": "${version}",
  "sections": [
    {
      "name": "category name",
      "commands": [
        { "description": "very short label, ideally 3-7 words", "command": "exact CLI syntax", "notes": "optional, only for real gotchas" }
      ]
    }
  ]
}

Rules — optimize for SPEED and DENSITY:
- 4 to 6 commands per section. Pick the most-used, highest-value ones.
- Descriptions: 3-7 words, action-oriented. NOT full sentences.
- Commands: minimal but complete. Show the essential lines of a config block only — not every option. Multi-line: use \\n.
- Notes: omit unless there's a non-obvious gotcha. Skip them by default.
- One section per requested category, in the order given.
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
// Poster-style cheat sheet PDF — three-column layout, color-coded section
// blocks, Fortinet-red top banner, wall-ready. Built with raw jsPDF (no
// autotable) so we can flow sections into columns the way a real cheat sheet
// poster does.
function exportCheatSheetPDF(sheet) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const date = todayStr();

  const margin = 30;
  const numCols = 3;
  const gutter = 14;
  const colW = (pageW - margin * 2 - gutter * (numCols - 1)) / numCols;

  const headerH = 78;
  const footerH = 26;
  const colTop = margin + headerH + 8;
  const colBottom = pageH - footerH;

  // Section header palette — rotates across sections for the poster look.
  const SECTION_PALETTE = [
    [218, 41, 28],   // Fortinet red
    [31, 41, 55],    // slate
    [29, 78, 216],   // deep blue
    [22, 101, 52],   // forest
    [146, 64, 14],   // amber
    [67, 56, 202],   // indigo
    [157, 23, 77],   // magenta
    [21, 94, 117],   // teal-dark
  ];

  let curCol = 0;
  let curY = colTop;

  const colX = (idx) => margin + idx * (colW + gutter);

  const drawHeader = () => {
    // Solid Fortinet-red banner
    doc.setFillColor(218, 41, 28);
    doc.rect(0, 0, pageW, headerH, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(`${sheet.product}`, margin, 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('CLI REFERENCE', margin, 56);

    // Version + date on the right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`v${sheet.version}`, pageW - margin, 38, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(date.toUpperCase(), pageW - margin, 54, { align: 'right' });

    // Thin underline
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, headerH - 6, pageW - margin * 2, 0.8, 'F');
  };

  const drawFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `FortiCLI Reference  ·  ${sheet.product} v${sheet.version}  ·  Generated ${date}`,
      margin, pageH - 12
    );
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageW - margin, pageH - 12, { align: 'right' });
    // AI-generated disclaimer in small text, center-bottom
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(6.5);
    doc.text(
      'AI-generated — always validate against docs.fortinet.com before applying to production.',
      pageW / 2, pageH - 12, { align: 'center' }
    );
  };

  const advanceColumn = () => {
    curCol++;
    if (curCol >= numCols) {
      drawFooter();
      doc.addPage();
      drawHeader();
      curCol = 0;
    }
    curY = colTop;
  };

  drawHeader();

  (sheet.sections || []).forEach((section, sIdx) => {
    const color = SECTION_PALETTE[sIdx % SECTION_PALETTE.length];
    const sectionHeaderH = 18;
    const sectionGap = 12;

    // Reserve room for the section header + at least one command line.
    // If we don't have ~60pt left in the current column, move on.
    if (curY + 70 > colBottom && curY !== colTop) {
      advanceColumn();
    }

    // Section header bar
    doc.setFillColor(...color);
    doc.roundedRect(colX(curCol), curY, colW, sectionHeaderH, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    const sectionName = (section.name || '').toUpperCase();
    doc.text(sectionName, colX(curCol) + 7, curY + 12);
    curY += sectionHeaderH + 4;

    // Commands
    (section.commands || []).forEach((cmd) => {
      const innerW = colW - 8;
      const descLines = doc.splitTextToSize(cmd.description || '', innerW);
      const cmdText = (cmd.command || '').replace(/\r/g, '');
      // Splitting monospace text — switch font BEFORE measuring to get
      // accurate character widths.
      doc.setFont('courier', 'bold');
      doc.setFontSize(7.6);
      const cmdLines = doc.splitTextToSize(cmdText, innerW);
      const cmdH = cmdLines.length * 9.2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const descH = descLines.length * 8.6;
      const entryH = descH + cmdH + 10;

      if (curY + entryH > colBottom) {
        advanceColumn();
        // Continuation header — slimmer, same color, "(cont.)" suffix
        doc.setFillColor(...color);
        doc.roundedRect(colX(curCol), curY, colW, sectionHeaderH, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(`${sectionName} (CONT.)`, colX(curCol) + 7, curY + 12);
        curY += sectionHeaderH + 4;
      }

      // Description line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(95, 95, 95);
      doc.text(descLines, colX(curCol) + 4, curY + 7);
      curY += descH + 1;

      // Subtle command pill background
      doc.setFillColor(248, 247, 244);
      doc.roundedRect(colX(curCol) + 2, curY - 1, colW - 4, cmdH + 6, 2, 2, 'F');

      // Command (monospace bold)
      doc.setFont('courier', 'bold');
      doc.setFontSize(7.6);
      doc.setTextColor(20, 20, 20);
      doc.text(cmdLines, colX(curCol) + 5, curY + 7);
      curY += cmdH + 8;
    });

    curY += sectionGap;
  });

  drawFooter();
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
function CheatSheetTab({ versions, onNeedApiKey }) {
  const PRODUCT_VERS = versions.cheatsheet;
  const [product, setProduct] = useState('FortiGate');
  const [version, setVersion] = useState((PRODUCT_VERS['FortiGate'] || [''])[0]);
  const [selectedCats, setSelectedCats] = useState(() => new Set(PRODUCT_CATS['FortiGate']));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [truncated, setTruncated] = useState(false);

  // If the version list updates from remote, snap the selected version into it.
  useEffect(() => {
    const list = PRODUCT_VERS[product] || [];
    if (list.length > 0 && !list.includes(version)) setVersion(list[0]);
  }, [PRODUCT_VERS, product]); // eslint-disable-line react-hooks/exhaustive-deps

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
        max_tokens: 5000,
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

  const productVersions = PRODUCT_VERS[product] || [];

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
            <select value={version} onChange={e => setVersion(e.target.value)} style={{
              width: '100%', padding: '12px 14px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: '10px',
              color: T.text, fontSize: '14px', fontFamily: fonts.body,
            }}>
              {productVersions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
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

      {loading && <LoadingPanel statusMessages={CHEAT_STATUSES} jokes={DAD_JOKES} />}

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

          <CheatSheetDetails sheet={sheet} />
          <div style={{
            fontSize: '12.5px', color: T.textDim, textAlign: 'center',
            padding: '20px 16px', marginTop: '24px',
            background: T.surfaceAlt, border: `1px dashed ${T.border}`,
            borderRadius: '12px', lineHeight: '1.6',
          }}>
            💡 The on-screen view is the working list. Hit <strong style={{ color: T.text }}>Export PDF</strong> for the printable poster — color-coded sections, three-column layout, wall-ready.
          </div>
        </div>
      )}
    </div>
  );
}

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
function DiffTab({ versions, onNeedApiKey }) {
  const branches = versions.diffBranches || FALLBACK_VERSIONS.diffBranches;
  const [fromVer, setFromVer] = useState(branches[1] || branches[0]);
  const [toVer, setToVer] = useState(branches[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diff, setDiff] = useState(null);
  const [truncated, setTruncated] = useState(false);

  // If remote versions arrive with new branches, snap the selections into them.
  useEffect(() => {
    if (branches.length === 0) return;
    if (!branches.includes(fromVer)) setFromVer(branches[1] || branches[0]);
    if (!branches.includes(toVer)) setToVer(branches[0]);
  }, [branches]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <select value={fromVer} onChange={e => setFromVer(e.target.value)} style={{
              width: '100%', padding: '12px 14px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: '10px',
              color: T.text, fontSize: '14px', fontFamily: fonts.body,
            }}>
              {branches.map(v => <option key={v} value={v}>FortiOS {v}</option>)}
            </select>
          </div>
          <div>
            <Label>To version</Label>
            <select value={toVer} onChange={e => setToVer(e.target.value)} style={{
              width: '100%', padding: '12px 14px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: '10px',
              color: T.text, fontSize: '14px', fontFamily: fonts.body,
            }}>
              {branches.map(v => <option key={v} value={v}>FortiOS {v}</option>)}
            </select>
          </div>
        </div>

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

      {loading && <LoadingPanel statusMessages={DIFF_STATUSES} jokes={DAD_JOKES} />}

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
  const [versions, setVersions] = useState(FALLBACK_VERSIONS);

  useEffect(() => {
    let cancelled = false;
    loadVersions().then(data => { if (!cancelled) setVersions(data); });
    return () => { cancelled = true; };
  }, []);

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

      {tab === 'sheet' && <CheatSheetTab versions={versions} onNeedApiKey={onNeedApiKey} />}
      {tab === 'diff' && <DiffTab versions={versions} onNeedApiKey={onNeedApiKey} />}
    </div>
  );
}
