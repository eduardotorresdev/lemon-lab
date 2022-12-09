from .interfaces.ResourceInterface import ResourceInterface
from .providers.TicketProvider import TicketProvider
from .providers.ClockProvider import clockProvider
from .storage.TicketStorage import TicketStorage


class Start:
    __ticketProvider = TicketProvider()
    __name: str
    __lang: str

    def __init__(self, name: str, lang: str = 'pt_BR') -> None:
        self.__name = name
        self.__lang = lang
        clockProvider.start()
        pass

    def createResource(self, resource: ResourceInterface):
        self.__ticketProvider.setInitialState(resource)
        return resource

    def save(self, name: str, directory: str):
        storage = TicketStorage(self.__name, self.getTicketProvider())
        storage.save(name, self.__lang, directory)

    def getTicketProvider(self):
        return self.__ticketProvider
