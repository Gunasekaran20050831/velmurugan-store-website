class Distribution:
    def __init__(self, version):
        self.version = version

class DistributionNotFound(Exception):
    pass

def get_distribution(name):
    if name == "razorpay":
        return Distribution("1.4.1")
    return Distribution("0.0.0")
