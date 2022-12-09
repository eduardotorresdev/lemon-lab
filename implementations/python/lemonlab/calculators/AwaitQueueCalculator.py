from .BaseCalculator import BaseCalculator
import statistics
import time

class AwaitQueueCalculator(BaseCalculator):
    def compute(self):
        waitingTimes = self.getData('waitingTimes')
        waitingTimes.append(time.time() - self.startTime)

        return ("awaitQueue", statistics.median(waitingTimes))
        