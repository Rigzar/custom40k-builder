import openpyxl
import pandas as pd
import requests
import simplejson as json
from math import isnan
from io import BytesIO
import logging

def check_nan(value):
    value = str(value).lower()
    return value == 'nan' or value == 'null'

#really silly workaround, but it's not worth the effort doing it in a cleaner way.
NAMES_TOO_LONG_FOR_GOOGLE_SHEET = {
    "venerable_contemptor_dreadnough" : "venerable_contemptor_dreadnought",
    "dogmata_on_throne_of_condemnati" : "dogmata_on_throne_of_condemnation",
    "barracuda_air_superiority_fight" : "barracuda_air_superiority_fighter",
    }

SKIPPED_SHEETS = ["Henchman Warband"]
SKIPPED_SHEETS_LOWERCASE = [s.lower().replace(" ", "_") for s in SKIPPED_SHEETS]

# First step. Get the raw text from the google sheets and remove all empty rows and columns, leaving only useful raw data. 
def main():
    
    FACTIONS = {}
    with open("factions.csv", "r") as f:
        FACTIONS = {line.split(",")[0]: line.split(",")[1].strip() for line in f.readlines() if line.strip()}
        logging.debug(FACTIONS)
    
    for faction, sheet_id in FACTIONS.items():
        res = requests.get("https://docs.google.com/spreadsheets/export?exportFormat=xlsx&id=" + sheet_id)
        
        data = BytesIO(res.content)
        xlsx = openpyxl.load_workbook(filename=data)
        for sheet_name in xlsx.sheetnames:
            values = pd.read_excel(data, sheet_name=sheet_name)
            values = values.dropna(how='all')
            sheet_name = sheet_name.lower().replace("\'", "").replace(" ", "_")
            
            if sheet_name == "index":
                values = values.transpose()
            
            values = values.to_dict(orient="records")
            
            for i in range(len(values)):
                formatted_values = [v for k, v in values[i].items() if not check_nan(v)]
                values[i] = formatted_values
            
            # Remove the skipped sheets from the index
            if sheet_name == "index":
                for array in values:
                    for element in array:
                        if element in SKIPPED_SHEETS:
                            array.remove(element)
                            logging.debug(f"\n\n\nRemoved {element} from index because it is in the skipped sheets list.\n\n\n")
                            logging.debug(f"New index: {values}\n\n\n")
            
            if sheet_name in NAMES_TOO_LONG_FOR_GOOGLE_SHEET:
                sheet_name = NAMES_TOO_LONG_FOR_GOOGLE_SHEET[sheet_name]
                
            if sheet_name in SKIPPED_SHEETS_LOWERCASE:
                logging.debug(f"\n\n\nSkipping sheet {sheet_name} because it is in the skipped sheets list.\n\n\n")
                continue
                      
            logging.debug(f"Sheet: {sheet_name}")
            logging.debug(values)
            
            json.dump(values, open(f"raw/{faction.lower().replace(" ","_").replace("'", "")}/{sheet_name}.json", "w"), indent=4)
            
if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    main()