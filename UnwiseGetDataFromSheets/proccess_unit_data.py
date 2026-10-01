import json

FACTIONS = []
UNIT_CATEGORIES = ["HQ","Troops","Elite","Fast Attack","Heavy Support", "Transports", "Fortifications", "Flyers"]
UNIT_PATH = {
    "HQ":"hq",
    "Troops":"troops",
    "Elite":"elites",
    "Fast Attack":"fast_attack",
    "Heavy Support":"heavy_support",
    "Transports":"dedicated_transport",
    "Fortifications":"fortifications",
    "Flyers":"flyers"
}
MODEL_FORMAT = ["No.","NAME","M","WS","BS","S","T","W","I","A","LD","SV","POINTS"]
WEAPON_FORMAT = ["WEAPON", "RANGE", "TYPE", "S", "AP", "D", "ABILITIES"]

# Make a list of all the troops that exist in the faction's Index.json file. 
def proccess_faction_troops(faction_path, faction_name):
    ret = {}
    with open(f"raw/{faction_path}/index.json", "r") as f:
        #sheet is a list of lists, where each inner list is a row in the sheet. Data format: NxN
        sheet = json.load(f)
        #Make sure the correct faction is being processed. "join" is a syntax trick for converting strings. If it's correct, remove it.
        if "".join(sheet[0]) != faction_name:
            print(f"{sheet[0]} found, expected {faction_name}. Stopping the program.")
            exit()
        sheet = sheet[1:]
            
        #special rules are placed on the same collumn as HQ, so we remove them.
        sheet[0] = sheet[0][:sheet[0].index("Special rules")]
            
        for troop_category in sheet:
            # The first element of each troop_category should be the category name, check if it is valid
            category = "".join(troop_category[0])
            if category not in UNIT_CATEGORIES:
                print(f"{category} is not a valid unit category: {UNIT_CATEGORIES}. Stopping the program.")
                exit()
                
            ret[category] = troop_category[1:]
                
    return ret

def proccess_model(model_data):
    m, M = 1,1
    if "-" in str(model_data[0]):
        m, M = model_data[0].split("-")
    elif "*" in str(model_data[0]):
        m, M = 0, 1
    
    model_data = [str(x) for x in model_data]
    ret_model = {"stats": dict(zip(MODEL_FORMAT[2:-1], model_data[2:-1]))}
    ret_model["name"] = model_data[1]
    ret_model["min"] = int(m)
    ret_model["max"] = int(M)
    ret_model["points"] = int(model_data[-1]) if "-" not in str(model_data[-1]) else 0
    
    print(ret_model)
    return ret_model

def proccess_weapons(weapon_data):
    APP_FORMAT = "name", "range","type", "s", "ap", "d", "abilities"
    weapon_data = [str(x) for x in weapon_data]
    return dict(zip(APP_FORMAT, weapon_data))

# Intermediary step. Take the formatted data and format it into the app's unit data format. Save it to the processed folder.
def main():
    
    with open("factions.csv", "r") as f:
        FACTIONS = [line.split(",")[0] for line in f.readlines() if line.strip()]
    
    print(f"Factions found:{FACTIONS}")
    for faction in FACTIONS:
        
        faction_path = f"{faction.lower().replace(' ', '_')}"
        print(f"Processing {faction}...")
        faction_troops = proccess_faction_troops(faction_path, faction)
        print(f"Faction troops: {faction_troops}")
        
        proccessed_faction_units = {}
        for category, units in faction_troops.items():
            for unit in units:
                unit_name = "".join(unit)
                unit_lowercase_name = unit_name.lower().replace("'", "").replace(" ", "_").replace("\u00b4", "")
                raw_unit_path = f"raw/{faction_path}/{unit_lowercase_name}"
                
                app_unit_json = {"name" : unit_name, "models": []}
                with open(f"{raw_unit_path}.json", "r") as f:
                    unit_sheet = json.load(f)
                    print(f"\nProcessing {unit} at {raw_unit_path}.json")
                    
                    # Make sure the models are in the correct format, then discard it.
                    if unit_sheet[0] != MODEL_FORMAT:
                        print(f"Model format mismatch for {unit}. Expected {MODEL_FORMAT}, got {unit_data[0]}. Stopping the program.")
                        exit()
                    unit_sheet = unit_sheet[1:]
                    
                    ### MODELS
                    # Process all models in the unit sheet until we reach the weapons section.
                    while("is equipped with" not in "".join(str(unit_sheet[0]))):
                        print(f"raw data: {unit_sheet[0]}")
                        model = proccess_model(unit_sheet[0])
                        if "*" in str(unit_sheet[0][0]):
                            if "variant_models" not in app_unit_json:
                                app_unit_json["variant_models"] = [model]
                            else:
                                app_unit_json["variant_models"].append(model)
                        else:
                            app_unit_json["models"].append(model)
                        
                        unit_sheet = unit_sheet[1:]
                    
                    # calculate the min_cost of the unit based on the models and their points values
                    app_unit_json["min_cost"] = sum([(m["points"] * m["min"]) for m in app_unit_json["models"]])
                    # set the default size of the unit
                    app_unit_json["default_size"] = sum([m["min"] for m in app_unit_json["models"]])
                    
                    ### WEAPONS
                    app_unit_json["equipped_with"] = "".join(unit_sheet[0])
                    unit_sheet = unit_sheet[1:]
                    
                    # Make sure the weapons are in the correct format, then discard it.
                    if unit_sheet[0] != WEAPON_FORMAT:
                        print(f"Weapon format mismatch for {unit}. Expected {WEAPON_FORMAT}, got {unit_data[0]}. Stopping the program.")
                        exit()
                    unit_sheet = unit_sheet[1:]
                   
                    # Process all weapons in the unit sheet until we reach the options section.
                    app_unit_json["weapons"] = []
                    while "OPTIONS" not in unit_sheet[0]:
                        print(f"{unit_sheet[0]}")
                        #check for no weapons
                        if "-" == "".join(unit_sheet[0][0]):
                            unit_sheet = unit_sheet[1:]
                            continue
                        #check for variant weapons
                        if "*" in unit_sheet[0][0]:
                            temp_weapon_name = unit_sheet[0][0].replace("*", "")
                            unit_sheet = unit_sheet[1:]
                            while "-" in unit_sheet[0][0]:
                                unit_sheet[0][0] = temp_weapon_name + unit_sheet[0][0]
                                app_unit_json["weapons"].append(proccess_weapons(unit_sheet[0]))
                                unit_sheet = unit_sheet[1:]
                        else:
                            app_unit_json["weapons"].append(proccess_weapons(unit_sheet[0]))
                            unit_sheet = unit_sheet[1:]
                    
                    ### OPTIONS           
                    #  FOR NOW WE IGNORE THE OPTIONS SECTION, AS IT IS MANUAL
                    while "ABILITIES" not in unit_sheet[0]:
                        unit_sheet = unit_sheet[1:]
                    unit_sheet = unit_sheet[1:]
                    
                    ### ABILITIES
                    app_unit_json["abilities"] = []
                    # Process all abilities in the unit sheet until we reach the keywords section.
                    while "UNIT TYPE" not in unit_sheet[0]:
                        # ignore the "Upgrades:" row, as it is not needed in the app.
                        if "Upgrades:" in unit_sheet[0]:
                            unit_sheet = unit_sheet[1:]
                            continue
                        app_unit_json["abilities"] = app_unit_json["abilities"] + (unit_sheet[0])
                        unit_sheet = unit_sheet[1:]
                    unit_sheet = unit_sheet[1:]
                    
                    ### UNIT TYPE
                    # Add the unit type, switch to the next row, which should be the keywords header.
                    app_unit_json["unit_type"] = "".join(unit_sheet[0])
                    unit_sheet = unit_sheet[1:]
                    
                    # Make sure the next row is the keywords header, then discard it.
                    if unit_sheet[0] != ["KEYWORDS"]:
                        print(f"Keywords format mismatch for {unit}. Expected ['KEYWORDS'], got {unit_sheet[0]}. Stopping the program.")
                        exit()
                    unit_sheet = unit_sheet[1:]
                    
                    ### KEYWORDS
                    app_unit_json["keywords"] = unit_sheet[0]
        
                # Save the processed unit data to its respective path.
                proccessed_unit_path = f"processed/{faction.lower().replace(' ', '_')}/{UNIT_PATH[category]}/{unit_lowercase_name}.json"
                with open(proccessed_unit_path, "w") as f:
                    json.dump(app_unit_json, f, indent=4)
                    
if __name__ == "__main__":
    main()