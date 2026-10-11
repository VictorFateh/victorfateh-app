export const CITIES = [
  { id: 'melbourne',   name: 'Melbourne',                 country: 'Australia',   status: 'lived',   txt: 'melbourne',   lat: -37.8136, lng: 144.9631,  radius: 35000  },
  { id: 'sydney',      name: 'Sydney',                    country: 'Australia',   status: 'lived',   txt: 'sydney',      lat: -33.8688, lng: 151.2093,  radius: 25000  },
  { id: 'brisbane',    name: 'Brisbane',                  country: 'Australia',   status: 'visited', txt: 'brisbane',    lat: -27.4698, lng: 153.0251,  radius: 20000  },
  { id: 'cairns',      name: 'Cairns',                    country: 'Australia',   status: 'visited', txt: 'cairns',      lat: -16.9186, lng: 145.7781,  radius: 60000  },
  { id: 'philippines', name: 'Manila, Palawan & Boracay', country: 'Philippines', status: 'visited', txt: 'philippines', lat: 14.5995,  lng: 120.9842,  radius: 280000, sectionLocations: true, zoom: 6 },
  { id: 'portland',    name: 'Portland',                  country: 'USA',         status: 'lived',   txt: 'portland',    lat: 45.5051,  lng: -122.675,  radius: 22000, mapLocation: 'Portland Oregon' },
  { id: 'seattle',     name: 'Seattle',                   country: 'USA',         status: 'visited', txt: 'seattle',     lat: 47.6062,  lng: -122.3321, radius: 35000  },
  { id: 'munich',      name: 'Munich',                    country: 'Germany',     status: 'visited', txt: 'munich',      lat: 48.1372,  lng: 11.5756,   radius: 15000  },
];

// Shared by the travel page and its regression checks.
export function escapeHTML(text = '') {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

export function searchWords(query) {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function filterSections(sections, query) {
  const words = searchWords(query);
  if (!sections || !words.length) return sections;
  return sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const text = `${item.name} ${item.note} ${section.name}`.toLowerCase();
      return words.every(word => text.includes(word));
    }),
  })).filter(section => section.items.length);
}

export function highlight(text = '', query = '') {
  const words = searchWords(query);
  if (!words.length) return escapeHTML(text);
  const pattern = words.sort((a, b) => b.length - a.length)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const matches = String(text).matchAll(new RegExp(pattern, 'gi'));
  let html = '', offset = 0;
  for (const match of matches) {
    html += escapeHTML(text.slice(offset, match.index))
      + `<mark class="search-hl">${escapeHTML(match[0])}</mark>`;
    offset = match.index + match[0].length;
  }
  return html + escapeHTML(text.slice(offset));
}

export function mapsURL(item, city, section) {
  const location = city.sectionLocations ? section.name : (city.mapLocation || city.name);
  return 'https://www.google.com/maps/search/?api=1&query='
    + encodeURIComponent(`${item.name} ${location} ${city.country}`);
}
