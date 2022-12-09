from typing import Callable

class StatsProvider(object):
    __stats: dict = {
        "arrivals": 0,
        "serveds": 0,
        "waitingTimes": []
    }

    def getData(self, stat: str|None = None):
        if(stat == None):
            return self.__stats.copy()

        return self.__stats[stat]

    def setData(self, stat: str|Callable):
        if(callable(stat)):
            self.__stats[stat] = stat(self.__stats.copy())
            return

        self.__stats[stat] = stat


statsProvider = StatsProvider()