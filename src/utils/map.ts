export {}

declare global {
  interface Map<K, V> {
    getOrAdd(key: K, valueFactory: (key: K) => V): V;
  }
}

if(Map.prototype.getOrAdd === undefined) {
  Object.defineProperty(Map.prototype, "getOrAdd", {
    enumerable: false,
    writable: true,
    value: getOrAdd
  });
}

function getOrAdd<K, V>(this: Map<K, V>, key: K, valueFactory: (key: K) => V): V {
  let value = this.get(key);
  if(!value) {
    value = valueFactory(key);
    this.set(key, value);
  }
  return value;
}
