#clean up all raw and processed data files to free up space

import os
from pathlib import Path

UNIT_CATEGORIES = ["hq","troops","elites","fast_attack","heavy_support", "dedicated_transport", "fortifications", "flyers"]

def unlink_file(file_path):
    try:
        os.unlink(file_path)
        print(f"Deleted {file_path}.")
    except Exception as e:
        print(f"Error deleting {file_path}: {e}")

def main():
    with open("factions.csv", "r") as f:
        FACTIONS = [line.split(",")[0] for line in f.readlines() if line.strip()]
    
    FACTIONS = [faction.lower().replace(" ", "_").replace("'", "").replace("\u00b4", "") for faction in FACTIONS]
    print(f"Cleaning up raw and processed data files for factions: {FACTIONS}")
    
    for faction in FACTIONS:
        raw_dir = Path(f'raw/{faction}')
        raw_files = [f for f in raw_dir.iterdir()]
        
        ## clean up raw files    
        for filename in raw_files:
            unlink_file(raw_dir / filename.name)

        ## clean up processed files
        for category in UNIT_CATEGORIES:
            processed_dir = Path(f'processed/{faction}/{category}')
            processed_files = [f for f in processed_dir.iterdir()]
            
            for filename in processed_files:
                unlink_file(processed_dir / filename.name)
   
if __name__ == "__main__":
    main()