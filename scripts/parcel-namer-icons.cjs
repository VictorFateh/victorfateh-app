const { Namer } = require('@parcel/plugin');
const path = require('node:path');

// Keep the site icon URLs stable for crawlers; leave other assets to Parcel.
const iconNames = ['favicon.ico', 'icon.png', 'icon-512.png', 'apple-touch-icon.png'];
const iconPaths = new Map(iconNames.map(name => [path.resolve(__dirname, '..', name), name]));

module.exports = new Namer({
  name({ bundle }) {
    const entry = bundle.getMainEntry();
    return entry ? iconPaths.get(entry.filePath) ?? null : null;
  }
});
