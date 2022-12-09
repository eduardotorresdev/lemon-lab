from copy import deepcopy
from lemonlab.providers.TicketProvider import TicketProvider
from lemonlab.providers.MetricProvider import MetricProvider
from lemonlab.providers.EventProvider import EventProvider
from lemonlab.providers.StatsProvider import StatsProvider
from ..interfaces.ResourceInterface import ResourceInterface


class Resource(ResourceInterface):
    __queueId: int = 0
    __usage: int
    __queue: list[int]
    __metrics: MetricProvider
    __stats: StatsProvider
    __events: EventProvider

    def __init__(self, name) -> None:
        super().__init__(name)
        self.__queue = []
        self.__usage = 0
        self.__metrics = MetricProvider()
        self.__stats = StatsProvider()
        self.__events = EventProvider(self, self.__stats, self.__metrics)

    def getEvents(self):
        return self.__events

    def getMetrics(self):
        return self.__metrics

    def getStats(self):
        return self.__stats

    def pushQueue(self):
        self.__queueId += 1
        queue = self.getQueue()
        queue.append(self.__queueId)
        self.__queue = queue

    def pullQueue(self):
        queue = self.getQueue()
        queue.pop(0)
        self.__queue = queue

    def getQueue(self):
        return self.__queue.copy()

    def setMetric(self, data):
        self.getMetrics().setData(data[0], data[1])

    def toJson(self) -> tuple[str, any]:
        return ("resources", {
            'name': self.getName(),
            'usage': self.__usage,
            'queue': self.__queue,
            'metrics': self.__metrics.toJson()
        })

    def takeSnapshot(self):
        TicketProvider().push(deepcopy(self))