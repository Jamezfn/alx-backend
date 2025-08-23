#!/usr/bin/env python
"""
LFU Caching
"""
from base_caching import BaseCaching
class LFUCache(BaseCaching):
    """ LFUCache defines a LFU caching system """
    def __init__(self):
        """ Initialise """
        super().__init__()
        self.freq = {}
        self.order = []

    def put(self, key, item):
        """ Add an item in the cache using LFU """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.freq[key] += 1

            if key in self.order:
                self.order.remove(key)
            self.order.append(key)
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            min_freq = min(self.freq.values())
            candidates = [k for k in self.order if self.freq[k] == min_freq]
            discard = candidates[0]
            self.cache_data.pop(discard)
            self.freq.pop(discard)
            self.order.remove(discard)
            print("DISCARD:", discard)

        self.cache_data[key] = item
        self.freq[key] = 1
        self.order.append(key)

    def get(self, key):
        """Get an item from cache"""
        if key is None or key not in self.cache_data:
            return None

        self.freq[key] += 1
        if key in self.order:
            self.order.remove(key)
        self.order.append(key)
        return self.cache_data.get(key, None)
