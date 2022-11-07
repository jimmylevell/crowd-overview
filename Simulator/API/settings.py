def init():
    global carla_port
    carla_port = 3000

    global carla_download_path
    carla_download_path = "https://download.app.levell.ch/crowdmanager/CARLA_0.9.13.zip"

    global number_of_cameras
    number_of_cameras = 2

    global number_of_vehicles
    number_of_vehicles = 100

    global number_of_walkers
    number_of_walkers = 100

    global percentage_pedestrians_running
    percentage_pedestrians_running = 0.0  # how many pedestrians will run

    global percentage_pedestrians_crossing
    percentage_pedestrians_crossing = 0.0  # how many pedestrians will cross
