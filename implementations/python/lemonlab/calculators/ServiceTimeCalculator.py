from .BaseCalculator import BaseCalculator

class ServiceTimeCalculator(BaseCalculator):
    def compute(self):
        return ("serviceTime", 1 / self.getData('serviceRate'))
        