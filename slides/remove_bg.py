from rembg import remove
from PIL import Image
import os

logos_dir = "public/logos"

files = [
    ("postgres.jpeg", "postgres-nobg.png"),
    ("mysql.jpeg", "mysql-nobg.png"),
    ("sqlserver.png", "sqlserver-nobg.png"),
]

for input_file, output_file in files:
    input_path = os.path.join(logos_dir, input_file)
    output_path = os.path.join(logos_dir, output_file)

    print(f"Processing {input_file}...")
    with open(input_path, "rb") as f:
        input_data = f.read()

    output_data = remove(input_data)

    with open(output_path, "wb") as f:
        f.write(output_data)

    print(f"Saved {output_file}")

print("Done!")
