import { readFileSync, readdirSync } from 'node:fs';
import { CITIES, mapsURL } from './travel-guide.mjs';
import { collectSpots, groupMappedSpots } from './travel-map-data.mjs';
import builder from './build-travel-data.js';

const directory = new URL('../travel-lists/', import.meta.url);
const guides = Object.fromEntries(readdirSync(directory).filter(file => file.endsWith('.txt'))
  .map(file => [file.slice(0, -4), builder.parseTxt(readFileSync(new URL(file, directory), 'utf8'))]));
const { locations } = JSON.parse(readFileSync(new URL('locations.json', directory), 'utf8'));
const spots = collectSpots(CITIES, guides, locations);

if (process.argv.includes('--csv')) {
  const quote = value => `"${String(value).replaceAll('"', '""')}"`;
  console.log('City,Category,Place,Note,Reason,Google Maps');
  for (const spot of spots.filter(spot => !spot.location)) {
    console.log([spot.city.name, spot.section.name, spot.item.name, spot.item.note,
      spot.item.isRoute ? 'Route: requires multiple locations' : 'Location needs confirmation',
      mapsURL(spot.item, spot.city, spot.section)].map(quote).join(','));
  }
} else {
  for (const city of CITIES) {
    const entries = spots.filter(spot => spot.city.id === city.id);
    console.log(`${city.name}: ${entries.filter(spot => spot.location).length}/${entries.length} entries mapped`);
  }
  console.log(`${groupMappedSpots(spots).length} distinct pins; ${spots.filter(spot => !spot.location).length} entries need locations.`);
  console.log('Use --csv to export the entries that still need a location.');
}
