import openpyxl
import pandas as pd
import requests
import simplejson as json
from math import isnan
from io import BytesIO

def check_nan(value):
    value = str(value).lower()
    return value == 'nan' or value == 'null'

if __name__ == "__main__":
    
    factions = {}
    with open("factions.csv", "r") as f:
        factions = {line.split(",")[0]: line.split(",")[1].strip() for line in f.readlines() if line.strip()}
        print(factions)
    
    for faction, sheet_id in factions.items():
        res = requests.get("https://docs.google.com/spreadsheets/export?exportFormat=xlsx&id=" + sheet_id)
   
        data = BytesIO(res.content)
   
        xlsx = openpyxl.load_workbook(filename=data)
        for sheet in xlsx.sheetnames:
            values = pd.read_excel(data, sheet_name=sheet)
            values = values.dropna(how='all')
            sheet = sheet.lower().replace("\'", "").replace(" ", "_")
            
            if sheet == "index":
                values = values.transpose()
            
            values = values.to_dict(orient="records")
            
            for i in range(len(values)):
                formatted_values = [v for k, v in values[i].items() if not check_nan(v)]
                values[i] = formatted_values
                      
            print(f"Sheet: {sheet}")
            print(values)
            json.dump(values, open(f"raw/{faction.lower().replace(" ","_")}/{sheet}.json", "w"), indent=4)