import get_units_from_sheets
import proccess_unit_data
import replace_app_units_with_proccessed_units

# Centralised script to run all the steps in order.       
if __name__ == "__main__":
    get_units_from_sheets.get_units_from_sheets()
    proccess_unit_data.proccess_unit_data()
    replace_app_units_with_proccessed_units.replace_app_units_with_proccessed_units()