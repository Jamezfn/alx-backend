#!/usr/bin/env python

""" FIFO caching """
from base_caching import BaseCaching

class FIFOCache(BaseCaching):
    """ FIFOCache defines a FIFO caching system """
    def __init__(self):
        """ Initiliaze """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """ Add an item in the cache using FIFO """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            return

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            oldest_key = self.queue.pop(0)
            del self.cache_data[oldest_key]
            print("DISCARD:", oldest_key)

        self.cache_data[key] = item
        self.queue.append(key)

    def get(self, key):
        """ Get an item from cache """
        if key is None:
            return None
        return self.cache_data.get(key, None)
