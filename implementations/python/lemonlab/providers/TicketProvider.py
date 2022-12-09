from copy import deepcopy
from ..interfaces.ResourceInterface import ResourceInterface
from ..models.Ticket import Ticket

def singleton(class_):
    instances = {}
    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getinstance
@singleton
class TicketProvider(object):
    __tickets: list[Ticket] = []

    def setInitialState(self, resource: ResourceInterface):
        tickets = self.getTickets()

        resources = {} if len(tickets) == 0 else tickets[0].getResources()
        resources[resource.getHash()] = deepcopy(resource)

        ticket = Ticket(resources)

        if(len(tickets) == 0):
            tickets.append(ticket)
        else:
            tickets[0] = ticket

        self._setTickets(tickets)

    def push(self, resource: ResourceInterface):
        lastState = self.getLastState()
        lastState[resource.getHash()] = resource

        self.__tickets.append(Ticket(lastState))

    def _setTickets(self, tickets: list[Ticket]):
        self.__tickets = tickets

    def getLastState(self):
        tickets = self.getTickets()

        if(len(tickets) == 0):
            return {}

        return tickets.pop().getResources()

    def getTickets(self):
        return self.__tickets.copy()

    def toJson(self):
        return list(map(lambda x : x.toJson(), self.getTickets()))