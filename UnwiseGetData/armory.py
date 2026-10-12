import json
import os
import logging
# Takes a weapon column from the raw sheet and formats it into the app's weapon data format. Returns a dictionary with the weapon data.
def proccess_prices(prices):
    
    p_unit, p_char = None, None
    
    match len(prices):

        case 0:
            print(f"Error: Weapon {weapon_data[0]} has no price data.")
            exit()
        
        case 1:
            try:
                p_char = int(prices[0])
            except:
                p_char = None
                
        case 2:
            try:
                p_unit = int(prices[0])
            except:
                p_unit = None
            try:
                p_char = int(prices[1])
            except:
                p_char = None
        
        case _:
            print(f"Error: {prices} has too many price data.")
            exit()
            
    return p_unit, p_char

def process_weapon(weapon_data):
    APP_FORMAT = "name", "range","type", "s", "ap", "d", "abilities"
    prices = weapon_data[len(APP_FORMAT):]
    
    p_unit, p_char = proccess_prices(prices)
    
    weapon_data = [str(x) for x in weapon_data]
    print(f"Processed weapon data: {weapon_data}, p_unit: {p_unit}, p_char: {p_char}")
    return dict(zip(APP_FORMAT, weapon_data)).update({"p_unit": p_unit, "p_char": p_char})

# Proccess and update the armory data from /raw/{faction} into the /data/parsed/{faction} folder 
def main():
    FACTIONS = []
    with open("factions.csv", "r") as f:
        FACTIONS = [line.split(",")[0] for line in f.readlines() if line.strip()]
    
    ## MANUAL OVERWRITE FOR TESTING PURPOSES
    FACTIONS = ["Tyranids"]
    
    for faction in FACTIONS:
        print(f"Processing {faction} armory...")
        
        #find all files with the "armory" word in the name in the raw/{faction} folder
        
        with open(f"raw/{faction.lower().replace(' ', '_')}/armory.json", "r") as f:
            armory_data = json.load(f)
            print(f"Armory data: {armory_data}")
            
            # Check the first element of the armory_data to see if it matches the expected format
            if "Unless stated otherwise" not in "".join(armory_data[0]):
                print(f"Armory data is not in the expected format. Stopping the program.")
                exit()
            # skip the "unless stated otherwise" and weapon header lines
            armory_data = armory_data[2:]
            
            # Process the weapons data into the app's weapon data format
            weapons = []
            
            while "POINTS" not in "".join(str(armory_data[0])):
                print(f"Processing weapon data: {armory_data[0]}")
                weapon_data = armory_data.pop(0)
                weapons.append(process_weapon(weapon_data))
                
            print(f"Processed weapons data: {weapons}")
                             

if __name__ == "__main__":
    main()