def total_calories(recipe):
    items = recipe["ingredients"]
    return sum(i["calories"] * i.get("servings", 1) for i in items)
