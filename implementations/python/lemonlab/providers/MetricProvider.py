class MetricProvider(object):
    __metrics: dict = {
        "usage": None,
        "arrivalRate": None,
        "serviceRate": None,
        "serviceTime": None,
        "awaitSystem": None,
        "awaitQueue": None
    }

    def setData(self, metric: str, value: float) -> None:
        metrics = self.__metrics.copy()
        metrics[metric] = value
        self.__metrics = metrics

    def getData(self, metric: str) -> float|None:
        return self.__metrics[metric]

    def toJson(self):
        return self.__metrics