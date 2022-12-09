from .BaseCalculator import BaseCalculator
from ..providers.ClockProvider import clockProvider

class ServiceRateCalculator(BaseCalculator):
    def compute(self):
        return ('serviceRate', (self.getData('serveds') + 1) / clockProvider.getTime())
