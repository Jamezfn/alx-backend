#!/usr/bin/env python
"""
LIFO Caching
"""
from base_caching import BaseCaching
class LRUCache(BaseCaching):
    """ LRUCache defines a LRU caching system """
    def __init__(self):
        """ Initialise """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """ Add an item in the cache using LRU """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            if key in self.queue:
                self.queue.remove(key)
            self.queue.append(key)
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            lru_key = self.queue.pop(0)
            del self.cache_data[lru_key]
            print(f"DISCARD: {lru_key}")

        self.cache_data[key] = item
        self.queue.append(key)

    def get(self, key):
        """Get an item from cache"""
        if key is None or key not in self.cache_data:
            return None

        self.queue.remove(key)
        self.queue.append(key)
        return self.cache_data.get(key, None)
