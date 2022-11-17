import zipfile
import git
import subprocess

from pathlib import Path
from git import Repo
from tester import run

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]


def setup_evaluation(dst_val_tools_folder):
    import urllib.request
    import os

    # source: https://github.com/JonathonLuiten/TrackEval#official-evaluation-code
    print("Download official MOT evaluation repo")
    val_tools_url = "https://github.com/JonathonLuiten/TrackEval"
    try:
        Repo.clone_from(val_tools_url, dst_val_tools_folder)
    except git.exc.GitError as err:
        print("Eval repo already downloaded")

    print(
        "Get ground-truth txts, meta-data and example trackers for all currently supported benchmarks"
    )
    gt_data_url = "https://download.app.levell.ch/crowdmanager/data.zip"
    if not os.path.exists(dst_val_tools_folder / "data.zip"):
        urllib.request.urlretrieve(gt_data_url, dst_val_tools_folder / "data.zip")
    if not (dst_val_tools_folder / "data").is_dir():
        with zipfile.ZipFile(dst_val_tools_folder / "data.zip", "r") as zip_ref:
            zip_ref.extractall(dst_val_tools_folder)

    print("Download official MOT images")
    mot_gt_data_url = "https://download.app.levell.ch/crowdmanager/MOT20.zip"
    if not os.path.exists(dst_val_tools_folder / "MOT20.zip"):
        urllib.request.urlretrieve(mot_gt_data_url, dst_val_tools_folder / "MOT20.zip")
    if not (dst_val_tools_folder / "data" / "MOT20").is_dir():
        with zipfile.ZipFile(dst_val_tools_folder / "MOT20.zip", "r") as zip_ref:
            zip_ref.extractall(dst_val_tools_folder / "data" / "MOT20")


def main():
    dst_val_tools_folder = ROOT / "val_utils"
    setup_evaluation(dst_val_tools_folder)

    # set paths
    mot_seqs_path = dst_val_tools_folder / "data" / "MOT20" / "train"
    seq_paths = [p / "img1" for p in Path(mot_seqs_path).iterdir() if p.is_dir()]

    for i, seq_path in enumerate(seq_paths):
        # run tracking
        print("Run tracking on sequence", seq_path)
        run(files=seq_path.iterdir(), name=seq_path.parent.name, object_class=0)

    # run the evaluation on the generated txts
    subprocess.run(
        [
            "python",
            dst_val_tools_folder / "scripts/run_mot_challenge.py",
            "--BENCHMARK",
            "MOT20",
            "--TRACKERS_TO_EVAL",
            ROOT / "runs" / "tracks" / "exp7",
            "--SPLIT_TO_EVAL",
            "train",
            "--METRICS",
            "HOTA",
            "CLEAR",
            "Identity",
        ]
    )


if __name__ == "__main__":
    main()
