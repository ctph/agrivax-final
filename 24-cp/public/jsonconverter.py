import pandas as pd
import json

# Load the Excel file with header
df = pd.read_excel("home_page_table.xlsx", header=0)

# Ensure correct column names
df.columns = ['pdb_id', 'sequence', 'melting_point_K']

# Convert each row to a dict with pdb_id as key and others as subfields
data_dict = {
    row['pdb_id']: {
        'sequence': row['sequence'],
        'melting_point_K': row['melting_point_K']
    }
    for _, row in df.iterrows()
}

# Save to JSON
with open("home_page_table.json", "w", encoding="utf-8") as f:
    json.dump(data_dict, f, ensure_ascii=False, indent=4)

print("✅ Converted to home_page_table.json")
