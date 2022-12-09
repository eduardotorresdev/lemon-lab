from .BaseCalculator import BaseCalculator
from ..providers.ClockProvider import clockProvider

class ArrivalRateCalculator(BaseCalculator):
    def compute(self):
        return ("arrivalRate", (self.getData('arrivals') + 1) / clockProvider.getTime())
        