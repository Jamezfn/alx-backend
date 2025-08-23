#!/usr/bin/env python
"""
LIFO Caching
"""
from base_caching import BaseCaching
class LIFOCache(BaseCaching):
    """ LIFOCache defines a LIFO caching system """
    def __init__(self):
        """ Initialise """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """ Add an item in the cache using LIFO """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            newest_key = self.queue.pop()
            del self.cache_data[newest_key]
            print(f"DISCARD: {newest_key}")

        self.cache_data[key] = item
        self.queue.append(key)

    def get(self, key):
        """Get an item from cache"""
        if key is None:
            return None
        return self.cache_data.get(key, None)
