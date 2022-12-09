from ..interfaces.ResourceInterface import ResourceInterface


class Ticket:
    __resources:dict[str, ResourceInterface] = []

    def __init__(self, resources: dict[str, ResourceInterface]) -> None:
        self.__resources = resources
        pass

    def getResources(self):
        return self.__resources.copy()

    def toJson(self):
        ticket = {}

        for key, value in self.getResources().items():
            resource = value.toJson()
            type = resource[0]

            if(type not in ticket):
                ticket[type] = []

            ticket[type] = ticket[type] + [resource[1]]

        return ticket