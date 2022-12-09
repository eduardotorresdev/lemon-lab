import json


class ResourceInterface:
    __name: str
    __hash: str

    def __init__(self, name) -> str:
        self.__name = name
        self.__hash = hash(name)
        return self.__hash

    def getName(self):
        return self.__name

    def getHash(self):
        return self.__hash

    def toJson(self):
        return ('resources', {
            "name": self.getName()
        })