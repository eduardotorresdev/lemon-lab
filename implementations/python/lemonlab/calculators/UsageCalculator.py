from .BaseCalculator import BaseCalculator

class UsageCalculator(BaseCalculator):
    def compute(self):
        arrivalRate = self.getData('arrivalRate')
        serviceRate = self.getData('serviceRate')

        if(not arrivalRate or not serviceRate):
            return ('usage', 100)

        return ('usage', (arrivalRate / serviceRate) * 100)
