import os
import hashlib

def find_duplicates(root_folder):
    hashes = {}
    duplicates = []

    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename == ".DS_Store": continue
            path = os.path.join(dirpath, filename)
            with open(path, 'rb') as f:
                file_hash = hashlib.md5(f.read()).hexdigest()
            
            if file_hash in hashes:
                duplicates.append((path, hashes[file_hash]))
            else:
                hashes[file_hash] = path
    
    return duplicates

dups = find_duplicates("Pictures")
for p1, p2 in dups:
    print(f"Duplicate: {p1} == {p2}")
