export function addTravelBasemap({ L, map, maplibregl, style }) {
  let vectorLayer;
  let fallbackLayer;
  let startupTimer;
  let loaded = false;

  function useFallback() {
    clearTimeout(startupTimer);
    if (fallbackLayer) return;
    // Remove a failed WebGL layer without affecting venue markers or controls.
    if (vectorLayer && map.hasLayer(vectorLayer)) {
      map.removeLayer(vectorLayer);
    }
    fallbackLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'travel-basemap-fallback',
    }).addTo(map);
  }

  if (typeof maplibregl?.Map !== 'function' || typeof L.maplibreGL !== 'function') {
    useFallback();
    return;
  }

  try {
    vectorLayer = L.maplibreGL({
      style: structuredClone(style),
      attributionControl: false,
      interactive: false,
    });
    const onRemove = vectorLayer.onRemove;
    vectorLayer.onRemove = function (leafletMap) {
      // The adapter assumes construction succeeded. If WebGL creation threw,
      // still let Leaflet finish removing the layer and its event listeners.
      if (this.getMaplibreMap()) onRemove.call(this, leafletMap);
      else this.getContainer()?.remove();
    };
    vectorLayer.addTo(map);
    const renderer = vectorLayer.getMaplibreMap();
    // Leaflet provides the accessible map surface and all interactions.
    renderer.getCanvas().setAttribute('aria-hidden', 'true');
    renderer.getCanvas().removeAttribute('tabindex');
    renderer.once('load', () => {
      loaded = true;
      clearTimeout(startupTimer);
    });
    renderer.on('error', () => { if (!loaded) useFallback(); });
    renderer.on('webglcontextlost', useFallback);
    // A stalled tile/font request should not leave the map blank indefinitely.
    startupTimer = setTimeout(() => { if (!loaded) useFallback(); }, 12000);
    map.once('unload', () => clearTimeout(startupTimer));
  } catch {
    useFallback();
  }
}
