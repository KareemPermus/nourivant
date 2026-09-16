def total_calories(recipe):
    total = 0
    for item in recipe["ingredients"]:
        total += item["calories"]
    return total
