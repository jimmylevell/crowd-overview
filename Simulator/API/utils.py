import os
import zipfile
import urllib.request

import settings

from pathlib import Path

settings.init()


def get_actor_blueprints(world, filter, generation):
    bps = world.get_blueprint_library().filter(filter)

    if generation.lower() == "all":
        return bps

    # If the filter returns only one bp, we assume that this one needed
    # and therefore, we ignore the generation
    if len(bps) == 1:
        return bps

    try:
        int_generation = int(generation)
        # Check if generation is in available generations
        if int_generation in [1, 2]:
            bps = [
                x for x in bps if int(x.get_attribute("generation")) == int_generation
            ]
            return bps
        else:
            print(
                "   Warning! Actor Generation is not valid. No actor will be spawned."
            )
            return []
    except:
        print("   Warning! Actor Generation is not valid. No actor will be spawned.")
        return []


def remove_actors(world, actor):
    for v in world.get_actors().filter("*" + actor + "*"):
        print("Removing " + actor + " " + str(v.id))
        v.destroy()


def download_installer():
    ROOT = Path(os.path.abspath("")).resolve()
    CARLA_INSTLLAER = ROOT / ".." / "Carla"

    if not os.path.exists(CARLA_INSTLLAER / "CARLA_0.9.13.zip"):
        urllib.request.urlretrieve(
            settings.carla_download_path, CARLA_INSTLLAER / "CARLA_0.9.13.zip"
        )

    if not (CARLA_INSTLLAER / "WindowsNoEditor").is_dir():
        with zipfile.ZipFile(CARLA_INSTLLAER / "CARLA_0.9.13.zip", "r") as zip_ref:
            zip_ref.extractall(CARLA_INSTLLAER)
