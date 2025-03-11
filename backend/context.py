import asyncio

class Context:
    def __init__(self):
        self.train_data = None
        self.model = None
        self.epoch_graph_message_queue = asyncio.Queue()
        self.epoch_graph_successs_perc_message_quere = asyncio.Queue()
        self.visualization_message_queue = asyncio.Queue()

context = Context()

def get_context():
    return context