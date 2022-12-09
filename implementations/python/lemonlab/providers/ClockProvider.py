import time

class ClockProvider(object):
    __startTime: None

    def start(self):
        self.__startTime = time.time()

    def getTime(self):
        return time.time() - self.__startTime


clockProvider = ClockProvider()