/**
 * build-travel-data.js
 *
 * Reads every .txt file in travel-lists/, parses it into sections + items,
 * and injects the result into travel.html between the TRAVEL_DATA markers.
 *
 * Run automatically via `npm run dev` and `npm run build` (pre* hooks).
 * To update a city guide: edit the .txt file, then restart the dev server.
 */

const fs   = require('fs');
const path = require('path');

const TRAVEL_DIR = path.join(__dirname, '../travel-lists');
const HTML_FILE  = path.join(__dirname, '../travel.html');

// ── Parser ────────────────────────────────────────────────────────────────────
//
// Handles two formats found in Victor's notes:
//
//   ALL-CAPS headers (Melbourne/Sydney):
//     FOOD
//     Mensho Ramen (CBD, Michelin)
//
//   Blank-line-preceded headers (Portland/Philippines/etc.):
//     Boujie
//     Republica (best Mexican)
//
// A line is a section header if:
//   (a) It is ALL CAPS (with optional spaces/slashes), OR
//   (b) It is preceded by a blank line AND has no parentheses AND no arrow
//       AND starts with a capital letter
//
// Section names ending in " Shit" (Victor's city markers) are stripped or
// discarded if they end up with zero items underneath.

function normalizeHeader(raw) {
  return raw.replace(/\s+shit\s*$/i, '').trim() || raw.trim();
}

function parseTxt(raw) {
  const rawLines   = raw.split('\n');
  const sections   = [];
  let current      = null;
  let prevWasBlank = true; // treat start-of-file as "after a blank line"

  rawLines.forEach(rawLine => {
    const line = rawLine.trim();

    if (!line) {
      prevWasBlank = true;
      return;
    }

    const isAllCaps  = /^[A-Z][A-Z\/]+$/.test(line); // no spaces — "FOOD" yes, "BAR PLANET" no
    const hasParens  = /\(/.test(line);
    const hasArrow   = /—>|→|->/.test(line);
    const isHeader   = isAllCaps ||
      (prevWasBlank && !hasParens && !hasArrow && /^[A-Z]/.test(line));

    prevWasBlank = false;

    if (isHeader) {
      const name = normalizeHeader(line);
      current = { name, items: [] };
      sections.push(current);
      return;
    }

    if (!current) {
      current = { name: 'Places', items: [] };
      sections.push(current);
    }

    const isRoute = hasArrow;
    const match   = line.match(/^(.+?)\s*\(([^)]*)\)\s*$/);

    if (match) {
      current.items.push({ name: match[1].trim(), note: match[2].trim(), isRoute });
    } else {
      current.items.push({ name: line, note: '', isRoute });
    }
  });

  return sections.filter(s => s.items.length > 0);
}

// ── Read + parse all .txt files ───────────────────────────────────────────────

const data = {};

fs.readdirSync(TRAVEL_DIR).forEach(file => {
  if (!file.endsWith('.txt')) return;
  const key = path.basename(file, '.txt');
  const raw = fs.readFileSync(path.join(TRAVEL_DIR, file), 'utf8');
  data[key] = parseTxt(raw);
});

// ── Inject into travel.html ───────────────────────────────────────────────────
// Use indexOf + slice instead of regex/replace to avoid $ special-char issues.

const START_MARKER = '/* TRAVEL_DATA_START */';
const END_MARKER   = '/* TRAVEL_DATA_END */';

const html     = fs.readFileSync(HTML_FILE, 'utf8');
const startIdx = html.indexOf(START_MARKER);
const endIdx   = html.indexOf(END_MARKER);

if (startIdx === -1 || endIdx === -1) {
  console.error('[travel-data] ERROR: TRAVEL_DATA markers not found in travel.html');
  process.exit(1);
}

const json    = JSON.stringify(data);
const newHtml = html.slice(0, startIdx + START_MARKER.length)
  + '\nconst TRAVEL_DATA = ' + json + ';\n'
  + html.slice(endIdx);

fs.writeFileSync(HTML_FILE, newHtml);

const totalSpots    = Object.values(data).reduce((n, secs) =>
  n + secs.reduce((m, s) => m + s.items.length, 0), 0);
const totalSections = Object.values(data).reduce((n, secs) => n + secs.length, 0);

console.log(
  `[travel-data] built ${Object.keys(data).length} cities — ` +
  `${totalSections} sections — ${totalSpots} spots`
);
