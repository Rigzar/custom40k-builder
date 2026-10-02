import get_factions_from_sheets
import process_unit_data
import replace_app_units_with_proccessed_units

# Centralised script to run all the steps in order.       
if __name__ == "__main__":
    get_factions_from_sheets.main()
    process_unit_data.main()
    replace_app_units_with_proccessed_units.main()