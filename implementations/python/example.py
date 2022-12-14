"""
Gas Station Refueling example

Covers:

- Resources: Resource
- Resources: Container
- Waiting for other processes

Scenario:
  A gas station has a limited number of gas pumps that share a common
  fuel reservoir. Cars randomly arrive at the gas station, request one
  of the fuel pumps and start refueling from that reservoir.

  A gas station control process observes the gas station's fuel level
  and calls a tank truck for refueling if the station's level drops
  below a threshold.

"""
import itertools
import random

import simpy
import lemonlab

RANDOM_SEED = 42
GAS_STATION_SIZE = 200     # liters
THRESHOLD = 10             # Threshold for calling the tank truck (in %)
FUEL_TANK_SIZE = 35        # liters
FUEL_TANK_LEVEL = [5, 25]  # Min/max levels of fuel tanks (in liters)
REFUELING_SPEED = 0.001       # liters / second
TANK_TRUCK_TIME = 300      # Seconds it takes the tank truck to arrive
T_INTER = [3000, 5000]        # Create a car every [min, max] seconds
SIM_TIME = 500000            # Simulation time in seconds

def car(name, env, gas_station, fuel_pump, bomba: lemonlab.Resource):
    """A car arrives at the gas station for refueling.

    It requests one of the gas station's fuel pumps and tries to get the
    desired amount of gas from it. If the stations reservoir is
    depleted, the car has to wait for the tank truck to arrive.

    """
    fuel_tank_level = random.randint(*FUEL_TANK_LEVEL)
    bomba.setMetric(
            lemonlab.ArrivalRateCalculator(
                bomba.getStats().getData()).compute()
        )
    # print('%s arriving at gas station at %.1f' % (name, env.now))
    # print("FILA DA BOMBA:", len(gas_station.queue))
    priority = random.randint(0, 10)
    try:
        with gas_station.request(priority) as req:
            start = env.now

            queuePos = len(gas_station.queue)
            awaitQueue = None

            if(queuePos > 0):
                bomba.pushQueue(priority)
                awaitQueue = lemonlab.AwaitQueueCalculator(
                    bomba.getStats().getData(), True)

            bomba.setMetric(
                lemonlab.UsageCalculator({
                    "arrivalRate": bomba.getMetrics().getData('arrivalRate'),
                    "serviceRate": bomba.getMetrics().getData('serviceRate')
                }).compute()
            )
            bomba.takeSnapshot()
            # Request one of the gas pumps
            yield req
            if(queuePos > 0):
                bomba.pullQueue()
                bomba.takeSnapshot()

            # Get the required amount of fuel
            liters_required = FUEL_TANK_SIZE - fuel_tank_level
            yield fuel_pump.get(liters_required)

            # The "actual" refueling process takes some time
            yield env.timeout(liters_required / REFUELING_SPEED)
            bomba.setMetric(
                lemonlab.ServiceRateCalculator(
                    bomba.getStats().getData()).compute()
            )
            bomba.setMetric(
                lemonlab.UsageCalculator({
                    "arrivalRate": bomba.getMetrics().getData('arrivalRate'),
                    "serviceRate": bomba.getMetrics().getData('serviceRate')
                }).compute()
            )
            bomba.setMetric(
                lemonlab.ServiceTimeCalculator({
                    "serviceRate": bomba.getMetrics().getData('serviceRate')
                }).compute()
            )
            if(awaitQueue != None):
                bomba.setMetric(awaitQueue.compute())
                bomba.setMetric(
                    lemonlab.AwaitSystemCalculator({
                        "awaitQueue": bomba.getMetrics().getData('awaitQueue'),
                        "serviceTime": bomba.getMetrics().getData('serviceTime')
                    }).compute()
            )
            tanque.updatePercentage(fuel_pump.level / fuel_pump.capacity * 100)
            bomba.takeSnapshot()
    except simpy.Interrupt:
        bomba.interrupt()

def gas_station_control(env, fuel_pump, tanque):
    """Periodically check the level of the *fuel_pump* and call the tank
    truck if the level falls below a threshold."""
    while True:
        if fuel_pump.level / fuel_pump.capacity * 100 < THRESHOLD:
            # We need to call the tank truck now!
            # print('Calling tank truck at %d' % env.now)
            # Wait for the tank truck to arrive and refuel the station
            yield env.process(tank_truck(env, fuel_pump))

        yield env.timeout(10)  # Check every 10 seconds


def tank_truck(env, fuel_pump):
    """Arrives at the gas station after a certain delay and refuels it."""
    yield env.timeout(TANK_TRUCK_TIME)
    # print('Tank truck arriving at time %d' % env.now)
    ammount = fuel_pump.capacity - fuel_pump.level
    # print('Tank truck refuelling %.1f liters.' % ammount)
    yield fuel_pump.put(ammount)
    tanque.updatePercentage(fuel_pump.level / fuel_pump.capacity * 100)


def car_generator(env, gas_station, fuel_pump, bomba):
    """Generate new cars that arrive at the gas station."""
    for i in itertools.count():
        yield env.timeout(random.randint(*T_INTER))
        env.process(car('Car %d' % i, env, gas_station, fuel_pump, bomba))


# Setup and start the simulation
print('Gas Station refuelling')
random.seed(RANDOM_SEED)

# Create environment and start processes
env = simpy.Environment()
gas_station = simpy.PriorityResource(env, 2)
fuel_pump = simpy.Container(env, GAS_STATION_SIZE, init=GAS_STATION_SIZE)

lemon = lemonlab.Start("Simula????o de Posto")
bomba = lemon.createResource(lemonlab.ResourcePriority("Bomba de combust??vel"))
tanque = lemon.createResource(lemonlab.Container("Tanque de combust??vel"))

env.process(gas_station_control(env, fuel_pump, tanque))
env.process(car_generator(env, gas_station, fuel_pump, bomba))

# Execute!
env.run(until=SIM_TIME)

lemon.save(
    'simulacao-legal',
    '/Users/eduardo.torres/Desktop/LemonLabProject/implementations/python'
)
