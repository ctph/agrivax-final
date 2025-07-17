import os
import json

# Load original JSON
with open('home_page_table.json') as f:
    data = json.load(f)

# Directory containing all the actual .pdb files
pdb_dir = 'filtered_pdbs_frontend'

# Get a list of all .pdb filenames
pdb_files = os.listdir(pdb_dir)
pdb_map = {}

# Build a lookup from PDB ID to its full filename
for fname in pdb_files:
    if fname.endswith('.pdb'):
        name = fname.split('.')[0]  # e.g. 1ACW_A
        pdb_id = name.split('_')[0] # e.g. 1ACW
        if pdb_id not in pdb_map:
            pdb_map[pdb_id] = fname  # use the first match

# Update the JSON to include the filename
for pdb_id, info in data.items():
    if pdb_id in pdb_map:
        info['filename'] = pdb_map[pdb_id]
    else:
        info['filename'] = None  # or leave out if you prefer

# Save to a new file
with open('home_page_table_with_filenames.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✅ Done! Output written to home_page_table_with_filenames.json")
