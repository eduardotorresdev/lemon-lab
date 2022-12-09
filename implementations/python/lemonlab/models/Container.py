from copy import deepcopy
from lemonlab.providers.TicketProvider import TicketProvider
from ..interfaces.ResourceInterface import ResourceInterface


class Container(ResourceInterface):
    percentage: float = 100.0

    def __init__(self, name) -> None:
        super().__init__(name)

    def updatePercentage(self, percentage):
        self.percentage = round(percentage, 2)
        TicketProvider().push(deepcopy(self))

    def toJson(self) -> tuple[str, any]:
        return ("containers", {
            'name': self.getName(),
            'percentage': self.percentage
        })