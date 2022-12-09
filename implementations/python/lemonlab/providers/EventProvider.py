from .StatsProvider import StatsProvider
from .MetricProvider import MetricProvider
from ..interfaces.ResourceInterface import ResourceInterface
from typing import Callable


class EventProvider(object):
    __resource: ResourceInterface
    __stats: StatsProvider
    __metrics: MetricProvider
    __subscribers: dict = {}

    def __init__(self, resource: ResourceInterface, stats: StatsProvider, metrics: MetricProvider):
        self.__resource = resource
        self.__stats = stats
        self.__metrics = metrics

    def push(self, event: str, callback: Callable):
        if not event in self.__subscribers.keys():
            self.__subscribers[event] = []

        self.__subscribers[event].append(callback)

    def notify(self, event: str):
        if not event in self.__subscribers.keys():
            return

        for callback in self.__subscribers[event]:
            callback(self.__metrics, self.__stats.getData())
            self.__resource.updated()
