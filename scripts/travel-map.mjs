import { escapeHTML, mapsURL } from './travel-guide.mjs';
import { groupMappedSpots, matchingSpots } from './travel-map-data.mjs';

const ICONS = {
  food: '<path d="M5 3v7m3-7v7M4 7h5m-2.5 3v11M17 3c-3 3-3 8 0 9h2V3h-2Zm2 9v9"/>',
  coffee: '<path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 0 1 0 6h-2M7 3v2m5-2v2"/>',
  drinks: '<path d="M4 4h16l-8 9-8-9Zm8 9v7m-4 1h8M7 8h10"/>',
  places: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
};

export const mapIcon = category => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[category] ?? ICONS.places}</svg>`;

export function createVenueLayer({ L, map, spots, popupPadding, reducedMotion }) {
  const clustered = typeof L.markerClusterGroup === 'function';
  const layer = clustered ? L.markerClusterGroup({
    // Match the visible 30px discs, rather than their larger transparent hit areas.
    maxClusterRadius: 30,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    spiderfyOnMaxZoom: false,
    animate: !reducedMotion.matches,
    iconCreateFunction: cluster => L.divIcon({
      className: 'venue-cluster', iconSize: [44, 44], iconAnchor: [22, 22],
      html: `<span class="venue-cluster-count">${cluster.getChildCount()}</span><span class="sr-only"> places. Show places.</span>`,
    }),
  }) : L.featureGroup();

  if (clustered) layer.on('clusterclick clusterkeypress', event => {
    if (event.type === 'clusterkeypress' && event.originalEvent?.keyCode !== 13) return;
    const cluster = event.layer;
    // Nearby venues can share a building: let a small group fan out at any zoom.
    if (cluster.getChildCount() <= 8 || map.getZoom() === map.getMaxZoom()) cluster.spiderfy();
    else cluster.zoomToBounds();
  });

  const markersByKey = new Map();
  let shown = [];
  let currentFilter = {};

  const popupHTML = group => {
    const { item, city, section, location } = group[0];
    const notes = [...new Set(group.map(spot => spot.item.note).filter(Boolean))];
    return `<div class="venue-popup-content">
      <span class="venue-popup-category">${escapeHTML(city.name)} · ${escapeHTML(section.name)}</span>
      <h3>${escapeHTML(item.name)}</h3>
      ${notes.map(note => `<p>${escapeHTML(note)}</p>`).join('')}
      ${location.address ? `<p class="venue-popup-address">${escapeHTML(location.address)}</p>` : ''}
      <a href="${escapeHTML(mapsURL(item, city, section))}" target="_blank" rel="noopener noreferrer">Open in Google Maps <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
    </div>`;
  };

  function addMarker(group) {
    const spot = group[0];
    const marker = L.marker([spot.location.lat, spot.location.lng], {
      icon: L.divIcon({
        className: `venue-marker venue-${spot.category}`,
        html: `<span class="venue-marker-disc">${mapIcon(spot.category)}</span>`,
        iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -13],
      }),
      title: spot.item.name,
      alt: `${spot.item.name}. Show place details`,
      keyboard: true,
      riseOnHover: true,
    }).bindTooltip(escapeHTML(spot.item.name), { direction: 'top', offset: [0, -12], className: 'venue-tooltip' })
      .bindPopup(popupHTML(group), { className: 'venue-popup', maxWidth: 270, minWidth: 190 });

    marker.on('add', () => {
      const element = marker.getElement();
      element?.setAttribute('aria-label', `${spot.item.name}. Show place details`);
      element?.addEventListener('keydown', event => {
        if (event.key === ' ') { event.preventDefault(); marker.openPopup(); }
      });
    });
    marker.on('popupopen', () => {
      const popup = marker.getPopup();
      Object.assign(popup.options, popupPadding());
      popup.getElement()?.setAttribute('role', 'dialog');
      popup.getElement()?.setAttribute('aria-label', spot.item.name);
      popup.update();
    });
    group.forEach(entry => markersByKey.set(entry.key, marker));
    return marker;
  }

  function updateVisibility() {
    const visible = !!currentFilter.cityId || map.getZoom() >= 10;
    if (visible && !map.hasLayer(layer)) map.addLayer(layer);
    if (!visible && map.hasLayer(layer)) map.removeLayer(layer);
  }

  map.on('zoomend', updateVisibility);
  function setFilter(filter = {}) {
    currentFilter = filter;
    shown = matchingSpots(spots, filter);
    map.closePopup();
    layer.clearLayers();
    markersByKey.clear();
    groupMappedSpots(shown).forEach(group => layer.addLayer(addMarker(group)));
    updateVisibility();
    return shown;
  }

  function focus(key) {
    const marker = markersByKey.get(key);
    if (!marker) return false;
    // Avoid an asynchronous flyTo racing cluster expansion or a second selection.
    map.setView(marker.getLatLng(), 16, { animate: false });
    const open = () => {
      Object.assign(marker.getPopup().options, popupPadding());
      marker.openPopup();
      marker.getPopup().getElement()?.querySelector('a[href]')?.focus({ preventScroll: true });
    };
    if (clustered) layer.zoomToShowLayer(marker, open);
    else open();
    return true;
  }

  return { setFilter, focus };
}
