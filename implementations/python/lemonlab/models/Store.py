from ..interfaces.ResourceInterface import ResourceInterface


class Store(ResourceInterface):
    itemQuantity: int

    def toJson(self) -> tuple[str, any]:
        return ("stores", {
            'name': self.name,
            'itemQuantity': self.itemQuantity
        })