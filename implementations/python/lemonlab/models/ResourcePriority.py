from lemonlab.models.Resource import Resource


class ResourcePriority(Resource):
    _type = 'priority'

    def __init__(self, name) -> None:
        super().__init__(name)

    def pushQueue(self, priority = 0):
        self._queueId += 1
        queue = self.getQueue()

        queue.append({
            "id": self._queueId,
            "priority": priority
        })

        self._queue = queue
        self.sortQueue()

    def interrupt(self):
        queue = self.getQueue()

        self._queueId += 1
        queue.append({
            "id": self._queueId,
            "priority": -1
        })

        self._queue = queue
        self.sortQueue()
        self.takeSnapshot()
        self.pullQueue()
        self.takeSnapshot()

    def sortQueue(self):
        queue = self.getQueue()
        queue = sorted(queue, key=lambda i: i['id'])
        queue = sorted(queue, key=lambda i: i['priority'])
        self._queue = queue