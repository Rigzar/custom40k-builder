import proccess_unit_data as pud
import json

# Takes a weapon column from the raw sheet and formats it into the app's weapon data format. Returns a dictionary with the weapon data.
def process_weapon(weapon_data):
    APP_FORMAT = "name", "range","type", "s", "ap", "d", "abilities"
    prices = weapon_data[len(APP_FORMAT):]
    
    p_unit, p_char = None, None
    match len(prices):
        case 0:
            print(f"Error: Weapon {weapon_data[0]} has no price data.")
            exit()
        case 1:
            p_char = int(prices[0])
        case 2:
            p_unit, p_char = int(prices[0]), int(prices[1])
        case _:
            print(f"Error: Weapon {weapon_data} has too many price data.")
            exit()
    
    weapon_data = [str(x) for x in weapon_data]
    return dict(zip(APP_FORMAT, weapon_data)).update({"p_unit": p_unit, "p_char": p_char})

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
            # skip the "ARMORY" and "unless stated otherwise" lines
            armory_data = armory_data[2:]
            
                             

if __name__ == "__main__":
    main()