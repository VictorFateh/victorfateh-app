import test from 'node:test';
import assert from 'node:assert/strict';
import { addTravelBasemap } from '../scripts/travel-basemap.mjs';

function fixture({ available = true, throws = false, adapter = true } = {}) {
  const events = new Map();
  const layers = new Set();
  let fallbackCount = 0;
  const renderer = {
    on: (name, callback) => events.set(name, callback),
    once: (name, callback) => events.set(name, callback),
    getCanvas: () => ({ setAttribute() {}, removeAttribute() {} }),
  };
  const vector = {
    addTo() { layers.add(this); if (throws) throw new Error('WebGL initialization failed'); },
    onRemove() {},
    getMaplibreMap: () => renderer,
  };
  const L = {
    tileLayer: () => ({ addTo() { fallbackCount++; return this; } }),
    ...(adapter ? { maplibreGL: () => vector } : {}),
  };
  const map = {
    hasLayer: layer => layers.has(layer),
    removeLayer: layer => layers.delete(layer),
    once: (name, callback) => events.set(name, callback),
  };
  // MapLibre exports Map, but does not expose Mapbox's supported() method.
  addTravelBasemap({ L, map, maplibregl: available ? { Map: class {} } : undefined, style: { version: 8, sources: {}, layers: [] } });
  return { emit: name => events.get(name)?.(), fallbackCount: () => fallbackCount, vectorVisible: () => layers.has(vector) };
}

test('missing libraries and failed WebGL initialization retain a usable basemap', () => {
  for (const options of [{ available: false }, { adapter: false }, { throws: true }]) {
    const map = fixture(options);
    assert.equal(map.fallbackCount(), 1);
    assert.equal(map.vectorVisible(), false);
  }
});

test('initial loading errors remove the vector layer and fall back only once', () => {
  const map = fixture();
  map.emit('error');
  map.emit('error');
  assert.equal(map.vectorVisible(), false);
  assert.equal(map.fallbackCount(), 1);
});

test('a loaded map tolerates later tile errors but recovers from losing WebGL', () => {
  const map = fixture();
  map.emit('load');
  map.emit('error');
  assert.equal(map.vectorVisible(), true);
  assert.equal(map.fallbackCount(), 0);
  map.emit('webglcontextlost');
  assert.equal(map.vectorVisible(), false);
  assert.equal(map.fallbackCount(), 1);
});

test('stalled startup falls back, while successful load and map removal cancel the timer', t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const stalled = fixture();
  const loaded = fixture();
  const removed = fixture();
  loaded.emit('load');
  removed.emit('unload');
  t.mock.timers.tick(12000);
  assert.equal(stalled.fallbackCount(), 1);
  assert.equal(loaded.fallbackCount(), 0);
  assert.equal(removed.fallbackCount(), 0);
});
