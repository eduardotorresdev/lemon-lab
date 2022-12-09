import json

from ..providers.TicketProvider import TicketProvider
from ..lang.lang import langs
class TicketStorage:
    __ticketProvider: TicketProvider
    __name: str

    def __init__(
        self,
        name: str,
        ticketProvider: TicketProvider,
    ):
        self.__ticketProvider = ticketProvider
        self.__name = name

    def save(self, fileName, lang, directory):
        with open(f'{directory}/{fileName}.json', 'w') as f:
            json.dump({
                'name': self.__name,
                'lang': langs[lang],
                'tickets': self.__ticketProvider.toJson()
            }, f, indent=4)
            print("Simulation file created with success ✨")
