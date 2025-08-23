#!/usr/bin/env python
"""
Basic dictionary
"""

from base_caching import BaseCaching

class BasicCache(BaseCaching):
    """ BasicCache is a caching system with no limit """
    def put(self, key, item):
        """ Add an item to the cache """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """ Get an item from the cache """
        if key is None:
            return None
        return self.cache_data.get(key, None)
