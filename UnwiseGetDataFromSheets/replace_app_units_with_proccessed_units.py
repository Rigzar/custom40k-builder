import openpyxl
from pathlib import Path
import sys
import pandas as pd
import simplejson as json
from io import BytesIO

UNIT_CATEGORIES = ["hq","troops","elites","fast_attack","heavy_support", "dedicated_transport", "fortifications", "flyers"]

# Takes the processed unit data and updates the app's unit data with it. 
def main():
    
    with open("factions.csv", "r") as f:
        FACTIONS = [line.split(",")[0] for line in f.readlines() if line.strip()]
        FACTIONS = [faction.lower().replace(" ", "_").replace("'", "").replace("\u00b4", "") for faction in FACTIONS]
        
    for faction in FACTIONS:
        for category in UNIT_CATEGORIES:
            
            print(f"\nProcessing {faction} - {category}...")

            update_dir = Path(f'processed/{faction}/{category}')
            update_files = [f for f in update_dir.iterdir()]
            print(f"Update files: {[file.name for file in update_files]}")
            
            app_dir = Path(f'../data/parsed/{faction}/units/{category}')
            app_files = [f for f in app_dir.iterdir()]
            print(f"App files: {[file.name for file in app_files]}")
            
            print(f"Updating {len(list(app_files))} existing units in {app_dir} with new data from {update_dir}.")
            
            for filename in update_files:
                if filename.name not in [file.name for file in app_files]:
                    print(f"New file found: {filename.name}. Add manually! Quitting as a safety measure.")
                    exit()
                
                with open(app_dir / filename.name, "r") as f:
                    app_unit_json = json.load(f)
                    
                with open(update_dir / filename.name, "r") as f:
                    update_unit_json = json.load(f)
                    
                for k, v in update_unit_json.items():
                    if k not in app_unit_json:
                        print(f"Key {k} not found in existing unit data. This shouldn't happen - quitting!")
                        exit()
                    
                    app_unit_json[k] = v
                    
                with open(app_dir / filename.name, "w") as f:
                    print(f"Updating {app_dir / filename.name} with new data from {update_dir / filename.name}.")
                    json.dump(app_unit_json, f, indent=4)
                    
                    
    print("All units updated successfully.")
                
if __name__ == "__main__":
    main()