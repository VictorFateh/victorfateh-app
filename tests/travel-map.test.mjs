import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { CITIES } from '../scripts/travel-guide.mjs';
import { collectSpots, matchingSpots, groupMappedSpots, validLocation } from '../scripts/travel-map-data.mjs';
import builder from '../scripts/build-travel-data.js';

const city = { id: 'test', txt: 'test' };
const sections = [{ name: 'Food', items: [
  { name: 'Cafe One', note: 'CBD, noodles' },
  { name: 'Unknown', note: 'not located yet' },
  { name: 'A → B', note: '', isRoute: true },
] }, { name: 'Bars', items: [{ name: 'Cafe One', note: 'cocktails' }] }];
const location = { city: 'test', section: 'Food', name: 'Cafe One', lat: -37.8, lng: 144.9,
  source: 'https://www.openstreetmap.org/node/123' };

test('pins follow names through note edits and reordering, never array positions', () => {
  const changed = structuredClone(sections);
  changed[0].items.reverse();
  changed[0].items.find(item => item.name === 'Cafe One').note = 'updated note';
  const spots = collectSpots([city], { test: changed }, [location]);
  assert.equal(spots.filter(spot => spot.location).length, 1);
  assert.equal(spots.find(spot => spot.location).item.name, 'Cafe One');
  assert.equal(spots.find(spot => spot.location).item.note, 'updated note');
});

test('unknown, renamed, route and invalid-coordinate entries remain in the guide without pins', () => {
  const locations = [
    { ...location, name: 'Old Name' },
    { ...location, name: 'Unknown', lat: 190 },
    { ...location, name: 'A → B' },
  ];
  const spots = collectSpots([city], { test: sections }, locations);
  assert.equal(spots.length, 4);
  assert.equal(spots.filter(spot => spot.location).length, 0);
  assert.ok(!validLocation({ ...location, lng: '144.9' }));
  assert.ok(!validLocation({ ...location, source: 'javascript:alert(1)' }));
});

test('city, category and all search terms filter the same map and guide records', () => {
  const spots = collectSpots([city], { test: sections }, [location]);
  const filtered = matchingSpots(spots, { cityId: 'test', category: 'food', query: ' NOODLES cbd ' });
  assert.deepEqual(filtered.map(spot => spot.item.name), ['Cafe One']);
  assert.equal(matchingSpots(spots, { category: 'drinks', query: 'noodles' }).length, 0);
  assert.equal(matchingSpots(spots, { cityId: 'another' }).length, 0);
  assert.equal(matchingSpots(spots, { query: 'unknown' }).length, 1, 'unmapped notes stay searchable');
});

test('one venue listed in two categories produces one pin with both notes', () => {
  const spots = collectSpots([city], { test: sections }, [location, { ...location, section: 'Bars' }]);
  const groups = groupMappedSpots(spots);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].length, 2);
  assert.deepEqual(groups[0].map(spot => spot.item.note), ['CBD, noodles', 'cocktails']);
  assert.equal(groupMappedSpots(matchingSpots(spots, { category: 'drinks' }))[0].length, 1);
});

test('every saved location has provenance, valid coordinates and an existing non-route guide entry', () => {
  const directory = new URL('../travel-lists/', import.meta.url);
  const guides = Object.fromEntries(readdirSync(directory).filter(file => file.endsWith('.txt'))
    .map(file => [file.slice(0, -4), builder.parseTxt(readFileSync(new URL(file, directory), 'utf8'))]));
  const { locations } = JSON.parse(readFileSync(new URL('locations.json', directory), 'utf8'));
  const keys = locations.map(location => JSON.stringify([location.city, location.section, location.name]));
  assert.equal(new Set(keys).size, keys.length, 'duplicate map keys');
  for (const location of locations) assert.ok(validLocation(location), location.name);
  const spots = collectSpots(CITIES, guides, locations);
  assert.equal(spots.filter(spot => spot.location).length, locations.length, 'orphan or route coordinates');
});
