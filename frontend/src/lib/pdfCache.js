const _cache = new Map();

export function setCacheItem(key, value, ttlMs = 90000) {
  _cache.set(key, value);
  setTimeout(() => _cache.delete(key), ttlMs);
}

export function getCacheItem(key) {
  return _cache.get(key) ?? null;
}
