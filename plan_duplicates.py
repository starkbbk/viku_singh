import os
import hashlib
import json

def get_file_hash(path):
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def generate_deletion_plan(root_folder):
    hashes = {}
    duplicates = []
    
    # Priority: Event, Fashion, Street > Background
    # We want to keep files in Event/Fashion/Street over Background
    # If duplicates in Event vs Event, keep one.
    
    all_files = []
    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename == ".DS_Store" or filename.startswith("."): continue
            path = os.path.join(dirpath, filename)
            # Assign priority score: 
            # Event/Fashion/Street = 1, Background = 2 (higher is candidate for deletion)
            priority = 1
            if "Background" in path:
                priority = 2
            
            all_files.append((path, priority))

    # Sort files so we process non-Background first (to populate hash map with keepers)
    # Actually, we want to encounter the "keeper" first.
    # Scores: Event=1. If we see Event, we store hash. If we see Background (score 2) and hash exists, we mark Background for deletion.
    # If we see Event1 (score 1) and then Event2 (score 1), we mark Event2 for deletion (or deciding based on name).
    
    all_files.sort(key=lambda x: (x[1], x[0])) # Sort by priority (Event first), then path
    
    to_delete = []
    replacements = {} # deleted_path -> kept_path

    for path, priority in all_files:
        try:
            h = get_file_hash(path)
            if h in hashes:
                keeper = hashes[h]
                duplicates.append((path, keeper))
                to_delete.append(path)
                
                # If we are deleting a non-Background file, we need to record a replacement for Portfolio.tsx
                if "Background" not in path:
                     # Strip 'Pictures/' to get relative path for public/portfolio logic if needed, 
                     # but Portfolio.tsx uses public path.
                     # We assume filenames map to /portfolio/[Category]/[Filename]
                     replacements[path] = keeper
            else:
                hashes[h] = path
        except Exception as e:
            print(f"Error reading {path}: {e}")

    return to_delete, replacements

to_delete, replacements = generate_deletion_plan("Pictures")

print("FILES TO DELETE:")
for f in to_delete:
    print(f)

print("\nREPLACEMENTS (for Portfolio.tsx):")
for k, v in replacements.items():
    print(f"{k} -> {v}")

# Save to json for next step
with open("deletion_plan.json", "w") as f:
    json.dump({"to_delete": to_delete, "replacements": replacements}, f, indent=2)
