import pandas as pd
import json

# Load the Excel file with header
df = pd.read_excel("PDB_sequence_24cp.xlsx", header=0)

# Ensure correct column names
df.columns = ['pdb_id', 'sequence']

# Convert to dictionary
data_dict = dict(zip(df['pdb_id'], df['sequence']))

# Save to JSON
with open("PDB_sequence_24cp.json", "w", encoding="utf-8") as f:
    json.dump(data_dict, f, ensure_ascii=False, indent=4)

print("✅ Converted to PDB_sequence_24cp.json")
