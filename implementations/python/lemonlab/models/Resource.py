from copy import deepcopy
from lemonlab.providers.TicketProvider import TicketProvider
from lemonlab.providers.MetricProvider import MetricProvider
from lemonlab.providers.EventProvider import EventProvider
from lemonlab.providers.StatsProvider import StatsProvider
from ..interfaces.ResourceInterface import ResourceInterface


class Resource(ResourceInterface):
    _queueId: int = 0
    _usage: int
    _type = 'normal'
    _queue: list[dict]
    _metrics: MetricProvider
    _stats: StatsProvider
    _events: EventProvider

    def __init__(self, name) -> None:
        super().__init__(name)
        self._queue = []
        self._usage = 0
        self._metrics = MetricProvider()
        self._stats = StatsProvider()
        self._events = EventProvider(self, self._stats, self._metrics)

    def getEvents(self):
        return self._events

    def getMetrics(self):
        return self._metrics

    def getStats(self):
        return self._stats

    def pushQueue(self):
        self._queueId += 1
        queue = self.getQueue()
        queue.append({
            "id": self._queueId
        })
        self._queue = queue

    def pullQueue(self):
        queue = self.getQueue()
        queue.pop(0)
        self._queue = queue

    def getQueue(self):
        return self._queue.copy()

    def setMetric(self, data):
        self.getMetrics().setData(data[0], data[1])

    def toJson(self) -> tuple[str, any]:
        return ("resources", {
            'name': self.getName(),
            'type': self._type,
            'usage': self._usage,
            'queue': self._queue,
            'metrics': self._metrics.toJson()
        })

    def takeSnapshot(self):
        TicketProvider().push(deepcopy(self))