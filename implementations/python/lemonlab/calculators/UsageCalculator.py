from .BaseCalculator import BaseCalculator

class UsageCalculator(BaseCalculator):
    def compute(self):
        arrivalRate = self.getData('arrivalRate')
        serviceRate = self.getData('serviceRate')

        if(not arrivalRate or not serviceRate):
            return ('usage', None)

        return ('usage', min((arrivalRate / serviceRate) * 100, 100))
