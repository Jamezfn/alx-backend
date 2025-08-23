#!/usr/bin/env python
"""
MRU Caching
"""
from base_caching import BaseCaching
class MRUCache(BaseCaching):
    """ MRUCache defines a MRU caching system """
    def __init__(self):
        """ Initialise """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """ Add an item in the cache using MRU """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            if key in self.queue:
                self.queue.remove(key)
            self.queue.append(key)
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            mru_key = self.queue.pop()
            del self.cache_data[mru_key]
            print(f"DISCARD: {mru_key}")

        self.cache_data[key] = item
        self.queue.append(key)

    def get(self, key):
        """Get an item from cache"""
        if key is None or key not in self.cache_data:
            return None

        if key in self.queue:
            self.queue.remove(key)
        self.queue.append(key)
        return self.cache_data.get(key, None)
