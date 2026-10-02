import proccess_unit_data as pud
import json

# Proccess and update the armory data from /raw/{faction} into the /data/parsed/{faction} folder 
def main():
    FACTIONS = []
    with open("factions.csv", "r") as f:
        FACTIONS = [line.split(",")[0] for line in f.readlines() if line.strip()]
        
    for faction in FACTIONS:
        print(f"Processing {faction} armory...")
        
        #find all files with the "armory" word in the name in the raw/{faction} folder
        
        with open(f"raw/{faction.lower().replace(' ', '_')}/armory.json", "r") as f:
            armory_data = json.load(f)
            print(f"Armory data: {armory_data}")
            
            # Check the first element of the armory_data to see if it matches the expected format
            if armory_data[0] != "ARMORY":
                print(f"Armory data is not in the expected format. Stopping the program.")
                exit()
            armory_data = armory_data[1:]
            
            # Check the second element of the armory_data to see if it matches the expected format
            if "Unless stated otherwise" not in armory_data[0]:
                print(f"\"Unless stated otherwise\" missing. Stopping the program.")
                exit()
                             

if __name__ == "__main__":
    main()