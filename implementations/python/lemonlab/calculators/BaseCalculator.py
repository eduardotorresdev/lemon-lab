import time
from ..providers.MetricProvider import MetricProvider

class BaseCalculator:
    __data: dict
    startTime: float

    def __init__(
        self,
        data: dict | None = None,
        setStartTime: bool | None = False,
    ) -> None:
        if(setStartTime):
            self.startTime = time.time()

        if(data != None):
            self.__data = data

    def getData(self, stat: str):
        return self.__data[stat]

    def compute():
        pass
