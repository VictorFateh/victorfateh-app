import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { CITIES, filterSections, highlight, mapsURL } from '../scripts/travel-guide.mjs';
import builder from '../scripts/build-travel-data.js';

const directory = new URL('../travel-lists/', import.meta.url);
const guides = Object.fromEntries(readdirSync(directory).filter(file => file.endsWith('.txt'))
  .map(file => [file.slice(0, -4), builder.parseTxt(readFileSync(new URL(file, directory), 'utf8'))]));
const names = sections => sections.flatMap(section => section.items.map(item => item.name));

test('case and surrounding whitespace do not change search results', () => {
  assert.deepEqual(filterSections(guides.melbourne, ' RAMEN '), filterSections(guides.melbourne, 'ramen'));
  assert.deepEqual(filterSections(guides.melbourne, '  '), guides.melbourne);
});

test('search finds literal words without unrelated subsequence matches', () => {
  const results = names(filterSections(guides.melbourne, 'ramen'));
  assert.ok(results.includes('Mensho Ramen'));
  assert.ok(results.includes('GOGYO'));
  assert.ok(!results.includes('Henrietta'));
  assert.deepEqual(filterSections(guides.melbourne, 'zzzzzz'), []);
});

test('all search words must match, across the name, note and category', () => {
  assert.deepEqual(names(filterSections(guides.melbourne, 'Mensho CBD')), ['Mensho Ramen']);
  assert.deepEqual(names(filterSections(guides.philippines, 'El Nido Taraw')), ['Taraw Cliff']);
  assert.deepEqual(filterSections(guides.melbourne, 'ramen zzzzzz'), []);
});

test('highlighting escapes HTML and treats regex characters literally', () => {
  assert.equal(highlight('<img src=x onerror=alert(1)> & Ramen', 'RAMEN'),
    '&lt;img src=x onerror=alert(1)&gt; &amp; <mark class="search-hl">Ramen</mark>');
  assert.equal(highlight('Food (good)', '('), 'Food <mark class="search-hl">(</mark>good)');
  assert.equal(highlight('A & B'), 'A &amp; B');
});

test('Philippines map searches use the section destination and country', () => {
  const city = CITIES.find(city => city.id === 'philippines');
  for (const section of guides.philippines) {
    const item = section.items[0];
    const url = new URL(mapsURL(item, city, section));
    assert.equal(url.searchParams.get('api'), '1');
    assert.equal(url.searchParams.get('query'), `${item.name} ${section.name} Philippines`);
  }
});

test('Portland map searches specify Oregon and encode names safely', () => {
  const city = CITIES.find(city => city.id === 'portland');
  const url = new URL(mapsURL({ name: 'A & B #1' }, city, { name: 'Food' }));
  assert.equal(url.searchParams.get('query'), 'A & B #1 Portland Oregon USA');
  assert.equal(url.hash, '');
});

test('every note file is reachable from a city guide', () => {
  assert.deepEqual(CITIES.map(city => city.txt).sort(), Object.keys(guides).sort());
  assert.equal(new Set(CITIES.map(city => city.id)).size, CITIES.length);
  assert.equal(names(guides.munich).length, 4);
});

test('explicit headings preserve all-caps venues and entries after blank lines', () => {
  const sections = builder.parseTxt('## Food\nLUNE\n\nBAR PLANET\nCafe (coffee)\n## Places\nA → B');
  assert.deepEqual(names(sections), ['LUNE', 'BAR PLANET', 'Cafe', 'A → B']);
  assert.equal(sections[1].items[0].isRoute, true);
});

test('each source entry survives parsing and same-category duplicates are removed', () => {
  for (const [key, sections] of Object.entries(guides)) {
    const raw = readFileSync(new URL(`${key}.txt`, directory), 'utf8');
    const entryLines = raw.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('## '));
    assert.equal(names(sections).length, entryLines.length, key);
    for (const section of sections) {
      const normalized = section.items.map(item => item.name.toLowerCase());
      assert.equal(new Set(normalized).size, normalized.length, `${key}: ${section.name}`);
    }
  }
});
