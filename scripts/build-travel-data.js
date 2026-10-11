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
// Sections use explicit "## Food" headings. Everything else is a spot, even
// all-caps names or names following blank lines. Notes go in parentheses.

function parseTxt(raw) {
  const rawLines   = raw.split('\n');
  const sections   = [];
  let current      = null;

  rawLines.forEach(rawLine => {
    const line = rawLine.trim();

    if (!line) return;
    const hasArrow   = /—>|→|->/.test(line);
    if (line.startsWith('## ')) {
      const name = line.slice(3).trim();
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

function build() {
  const data = {};

  fs.readdirSync(TRAVEL_DIR).sort().forEach(file => {
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

  // An edited note must not be able to end the surrounding script element.
  const json    = JSON.stringify(data).replace(/</g, '\\u003c');
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
}

if (require.main === module) build();
module.exports = { parseTxt };
