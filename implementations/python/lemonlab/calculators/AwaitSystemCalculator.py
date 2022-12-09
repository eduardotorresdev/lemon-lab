from .BaseCalculator import BaseCalculator

class AwaitSystemCalculator(BaseCalculator):
    def compute(self):
        awaitQueue = self.getData('awaitQueue')
        serviceTime = self.getData('serviceTime')

        return ("awaitSystem", awaitQueue + serviceTime)