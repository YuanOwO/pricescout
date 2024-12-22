import json
import os

with open("static/categories.json", "r", encoding="utf-8") as f:
    categories = json.load(f)

with open("product.html", "r", encoding="utf-8") as f:
    product_template = f.read()

for cat in categories["category"]:
    cat1 = cat["name"]
    folder = f"{cat1}"
    os.makedirs(folder, exist_ok=True)
    with open(f"{folder}/index.html", "w", encoding="utf-8") as f:
        f.write(product_template)

    for cat in cat["children"]:
        cat2 = cat["name"]

        folder = f"{cat1}/{cat2}"
        os.makedirs(folder, exist_ok=True)
        with open(f"{folder}/index.html", "w", encoding="utf-8") as f:
            f.write(product_template)

        if "children" in cat:
            for cat in cat["children"]:
                cat3 = cat["name"]
                folder = f"{cat1}/{cat2}/{cat3}"
                os.makedirs(folder, exist_ok=True)
                with open(f"{folder}/index.html", "w", encoding="utf-8") as f:
                    f.write(product_template)
