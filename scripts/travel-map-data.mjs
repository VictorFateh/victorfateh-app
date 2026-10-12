import { searchWords } from './travel-guide.mjs';

export const MAP_CATEGORIES = [
  { id: 'all', label: 'All spots' },
  { id: 'food', label: 'Food' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'drinks', label: 'Bars & nightlife' },
  { id: 'places', label: 'Places' },
];

// Names, rather than row numbers, keep pins attached when the notes are reordered.
export const spotKey = (city, section, item) => JSON.stringify([city.id, section.name, item.name]);

export function validLocation(location) {
  return location && Number.isFinite(location.lat) && Number.isFinite(location.lng)
    && Math.abs(location.lat) <= 90 && Math.abs(location.lng) <= 180
    && /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/.test(location.source ?? '');
}

export function spotCategory(section, location) {
  const name = section.name.toLowerCase();
  if (/coffee|breakfast/.test(name)) return 'coffee';
  if (/bars|pubs|clubs/.test(name)) return 'drinks';
  if (/food|sweets|boujie|sit downs|bites/.test(name)) return 'food';
  if (/cafe/.test(location?.kind ?? '')) return 'coffee';
  if (/bar|pub|nightclub|biergarten/.test(location?.kind ?? '')) return 'drinks';
  if (/restaurant|fast_food|food_court|ice_cream|bakery/.test(location?.kind ?? '')) return 'food';
  return /eat\/drink/.test(name) ? 'food' : 'places';
}

export function collectSpots(cities, guides, locations) {
  const index = new Map(locations.map(location => [
    JSON.stringify([location.city, location.section, location.name]), location,
  ]));
  return cities.flatMap(city => (guides[city.txt] ?? []).flatMap(section => section.items.map(item => {
    const key = spotKey(city, section, item);
    const candidate = index.get(key);
    const location = !item.isRoute && validLocation(candidate) ? candidate : null;
    return { key, city, section, item, location, category: spotCategory(section, location) };
  })));
}

export function matchingSpots(spots, { cityId = null, category = 'all', query = '' } = {}) {
  const words = searchWords(query);
  return spots.filter(spot => (!cityId || spot.city.id === cityId)
    && (category === 'all' || spot.category === category)
    && words.every(word => `${spot.item.name} ${spot.item.note} ${spot.section.name}`.toLowerCase().includes(word)));
}

// A venue can appear in both Food and Bars. Keep one pin, with both guide entries.
export function groupMappedSpots(spots) {
  const groups = new Map();
  for (const spot of spots) {
    if (!spot.location) continue;
    const key = `${spot.city.id}:${spot.location.source}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(spot);
  }
  return [...groups.values()];
}
