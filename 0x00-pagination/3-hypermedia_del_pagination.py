#!/usr/bin/env python
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict

class Server:
    """Server class to paginate a database of popular baby names."""
    DATA_FILE = "Popular_Baby_Names.csv"
     
    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset"""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0"""
        dataset = self.dataset()
        truncated_dataset = dataset[:1000]
        self.__indexed_dataset = {i: truncated_dataset[i] for i in range(len(truncated_dataset))}
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Returns a dictionary containing pagination information"""
        assert isinstance(index, (int, type(None))), "Index must be an integer or None"
        index = 0 if index is None else index
        assert 0 <= index < len(self.dataset()), "Index out of range"
        
        indexed = self.indexed_dataset()
        data = []
        cur = index
        
        while len(data) < page_size and cur < len(self.dataset()):
            if cur in indexed:
                data.append(indexed[cur])
            cur += 1

        return {
            'index': index,
            'next_index': cur,
            'page_size': len(data),
            'data': data
        }
